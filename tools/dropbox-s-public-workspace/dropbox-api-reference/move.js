/**
 * Function to move a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the move operation.
 * @param {string} args.from_path - The path of the file or folder to move.
 * @param {string} args.to_path - The destination path where the file or folder should be moved.
 * @param {boolean} [args.allow_shared_folder=false] - Whether to allow moving shared folders.
 * @param {boolean} [args.autorename=false] - Whether to automatically rename the file if the destination path already exists.
 * @param {boolean} [args.allow_ownership_transfer=false] - Whether to allow ownership transfer when moving files.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the move operation.
 */
const executeFunction = async ({ from_path, to_path, allow_shared_folder = false, autorename = false, allow_ownership_transfer = false, team_member_id }) => {
  if (!team_member_id) {
    return { error: 'team_member_id is required for user file operations. Please provide the team_member_id to act as.' };
  }
  const url = 'https://api.dropboxapi.com/2/files/move_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const requestBody = {
    from_path,
    to_path,
    allow_shared_folder,
    autorename,
    allow_ownership_transfer
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    if (team_member_id) {
      headers['Dropbox-API-Select-User'] = team_member_id;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
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
    console.error('Error moving file or folder:', error);
    return { error: 'An error occurred while moving the file or folder.', details: error.message };
  }
};

/**
 * Tool configuration for moving files or folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'move_file_or_folder',
      description: 'Move a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          from_path: {
            type: 'string',
            description: 'The path of the file or folder to move.'
          },
          to_path: {
            type: 'string',
            description: 'The destination path where the file or folder should be moved.'
          },
          allow_shared_folder: {
            type: 'boolean',
            description: 'Whether to allow moving shared folders.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to automatically rename the file if the destination path already exists.'
          },
          allow_ownership_transfer: {
            type: 'boolean',
            description: 'Whether to allow ownership transfer when moving files.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        },
        required: ['from_path', 'to_path']
      }
    }
  }
};

export { apiTool };