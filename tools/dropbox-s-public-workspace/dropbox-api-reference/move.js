/**
 * Function to move a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the move operation.
 * @param {string} args.from_path - The path of the file or folder to move.
 * @param {string} args.to_path - The destination path where the file or folder should be moved.
 * @param {boolean} [args.allow_shared_folder=false] - Whether to allow moving shared folders.
 * @param {boolean} [args.autorename=false] - Whether to automatically rename the file if the destination path already exists.
 * @param {boolean} [args.allow_ownership_transfer=false] - Whether to allow ownership transfer when moving files.
 * @returns {Promise<Object>} - The result of the move operation.
 */
const executeFunction = async ({ from_path, to_path, allow_shared_folder = false, autorename = false, allow_ownership_transfer = false }) => {
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

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving file or folder:', error);
    return { error: 'An error occurred while moving the file or folder.' };
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
          }
        },
        required: ['from_path', 'to_path']
      }
    }
  }
};

export { apiTool };