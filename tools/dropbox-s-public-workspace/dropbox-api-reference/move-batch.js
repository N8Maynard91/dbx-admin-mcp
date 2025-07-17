/**
 * Function to move multiple files or folders in Dropbox.
 *
 * @param {Object} args - Arguments for the move operation.
 * @param {Array} args.entries - An array of objects specifying the files or folders to move.
 * @param {boolean} [args.autorename=false] - Whether to automatically rename files if a conflict occurs.
 * @param {boolean} [args.allow_ownership_transfer=false] - Whether to allow ownership transfer during the move.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the move operation.
 */
const executeFunction = async ({ entries, autorename = false, allow_ownership_transfer = false, team_member_id }) => {
  if (!team_member_id) {
    return { error: 'team_member_id is required for user file operations. Please provide the team_member_id to act as.' };
  }
  // Optionally, check that all entries are within the same user context if possible (not always possible to check, but document this limitation)
  const url = 'https://api.dropboxapi.com/2/files/move_batch_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    entries,
    autorename,
    allow_ownership_transfer
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    if (team_member_id) {
      headers['Dropbox-API-Select-User'] = team_member_id;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    return data;
  } catch (error) {
    console.error('Error moving files:', error);
    return { error: 'An error occurred while moving files.' };
  }
};

/**
 * Tool configuration for moving files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'move_batch',
      description: 'Move multiple files or folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            description: 'An array of objects specifying the files or folders to move.',
            items: {
              type: 'object',
              properties: {
                from_path: {
                  type: 'string',
                  description: 'The path from which to move the file or folder.'
                },
                to_path: {
                  type: 'string',
                  description: 'The path to which to move the file or folder.'
                }
              },
              required: ['from_path', 'to_path']
            }
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to automatically rename files if a conflict occurs.'
          },
          allow_ownership_transfer: {
            type: 'boolean',
            description: 'Whether to allow ownership transfer during the move.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };