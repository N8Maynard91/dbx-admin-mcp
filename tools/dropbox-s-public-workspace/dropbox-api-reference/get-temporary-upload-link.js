/**
 * Function to get a temporary upload link from Dropbox.
 *
 * @param {Object} args - Arguments for the upload link request.
 * @param {string} args.path - The path where the file will be uploaded.
 * @param {string} [args.mode="add"] - The mode for the upload (add, overwrite, etc.).
 * @param {boolean} [args.autorename=true] - Whether to auto-rename the file if it already exists.
 * @param {boolean} [args.mute=false] - Whether to mute notifications for the upload.
 * @param {boolean} [args.strict_conflict=false] - Whether to enforce strict conflict resolution.
 * @param {number} [args.duration=3600] - The duration in seconds for which the link will be valid.
 * @returns {Promise<Object>} - The response containing the temporary upload link.
 */
const executeFunction = async ({ path, mode = 'add', autorename = true, mute = false, strict_conflict = false, duration = 3600 }) => {
  const url = 'https://api.dropboxapi.com/2/files/get_temporary_upload_link';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    commit_info: {
      path,
      mode,
      autorename,
      mute,
      strict_conflict
    },
    duration
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting temporary upload link:', error);
    return { error: 'An error occurred while getting the temporary upload link.' };
  }
};

/**
 * Tool configuration for getting a temporary upload link from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_temporary_upload_link',
      description: 'Get a temporary upload link for Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path where the file will be uploaded.'
          },
          mode: {
            type: 'string',
            enum: ['add', 'overwrite'],
            description: 'The mode for the upload.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to auto-rename the file if it already exists.'
          },
          mute: {
            type: 'boolean',
            description: 'Whether to mute notifications for the upload.'
          },
          strict_conflict: {
            type: 'boolean',
            description: 'Whether to enforce strict conflict resolution.'
          },
          duration: {
            type: 'integer',
            description: 'The duration in seconds for which the link will be valid.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };