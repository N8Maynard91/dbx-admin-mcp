/**
 * Function to copy a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the copy operation.
 * @param {string} args.from_path - The path of the file or folder to copy.
 * @param {string} args.to_path - The destination path where the file or folder should be copied.
 * @param {boolean} [args.allow_shared_folder=false] - Whether to allow copying shared folders.
 * @param {boolean} [args.autorename=false] - Whether to automatically rename the file if a conflict occurs.
 * @param {boolean} [args.allow_ownership_transfer=false] - Whether to allow ownership transfer during the copy.
 * @returns {Promise<Object>} - The result of the copy operation.
 */
const executeFunction = async ({ from_path, to_path, allow_shared_folder = false, autorename = false, allow_ownership_transfer = false }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    from_path,
    to_path,
    allow_shared_folder,
    autorename,
    allow_ownership_transfer
  });

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

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
    console.error('Error copying file or folder:', error);
    return { error: 'An error occurred while copying the file or folder.', details: error.message };
  }
};

/**
 * Tool configuration for copying files or folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'copy_file_or_folder',
      description: 'Copy a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          from_path: {
            type: 'string',
            description: 'The path of the file or folder to copy.'
          },
          to_path: {
            type: 'string',
            description: 'The destination path where the file or folder should be copied.'
          },
          allow_shared_folder: {
            type: 'boolean',
            description: 'Whether to allow copying shared folders.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to automatically rename the file if a conflict occurs.'
          },
          allow_ownership_transfer: {
            type: 'boolean',
            description: 'Whether to allow ownership transfer during the copy.'
          }
        },
        required: ['from_path', 'to_path']
      }
    }
  }
};

export { apiTool };