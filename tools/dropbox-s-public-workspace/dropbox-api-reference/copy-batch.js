/**
 * Function to copy multiple files or folders in Dropbox.
 *
 * @param {Object} args - Arguments for the copy operation.
 * @param {Array<Object>} args.entries - An array of entries specifying the source and destination paths.
 * @param {boolean} [args.autorename=false] - Whether to autorename the files if the destination path already exists.
 * @returns {Promise<Object>} - The result of the copy operation.
 */
const executeFunction = async ({ entries, autorename = false }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_batch_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Prepare the request body
    const body = JSON.stringify({ entries, autorename });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error copying files:', error);
    return { error: 'An error occurred while copying files.' };
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
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };