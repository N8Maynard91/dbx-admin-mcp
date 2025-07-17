/**
 * Function to copy multiple files or folders in Dropbox.
 *
 * @param {Object} args - Arguments for the copy operation.
 * @param {Array<Object>} args.entries - An array of entries specifying the source and destination paths.
 * @param {boolean} [args.autorename=false] - Whether to autorename the files if the destination path already exists.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the copy operation.
 */
const executeFunction = async ({ entries, autorename = false, team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_batch_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  if (team_member_id) {
    headers['Dropbox-API-Select-User'] = team_member_id;
  }

  try {
    // Prepare the request body
    const body = JSON.stringify({ entries, autorename });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error copying files:', error);
    return { error: 'An error occurred while copying files.', details: error.message };
  }
};

/**
 * Tool configuration for copying files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'copy_batch',
      description: 'Copy multiple files or folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            description: 'An array of entries specifying the source and destination paths.',
            items: {
              type: 'object',
              properties: {
                from_path: {
                  type: 'string',
                  description: 'The source path of the file or folder.'
                },
                to_path: {
                  type: 'string',
                  description: 'The destination path where the file or folder will be copied.'
                }
              },
              required: ['from_path', 'to_path']
            }
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to autorename the files if the destination path already exists.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };