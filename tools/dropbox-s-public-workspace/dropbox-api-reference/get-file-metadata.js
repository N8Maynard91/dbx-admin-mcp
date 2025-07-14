/**
 * Function to get file metadata from Dropbox.
 *
 * @param {Object} args - Arguments for the file metadata request.
 * @param {string} args.file - The file identifier for which to retrieve metadata.
 * @param {Array} [args.actions=[]] - Optional actions to perform on the file.
 * @returns {Promise<Object>} - The metadata of the requested file.
 */
const executeFunction = async ({ file, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/get_file_metadata';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ file, actions });

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
    console.error('Error getting file metadata:', error);
    return { error: 'An error occurred while getting file metadata.' };
  }
};

/**
 * Tool configuration for getting file metadata from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_file_metadata',
      description: 'Retrieve metadata for a shared file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The file identifier for which to retrieve metadata.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Optional actions to perform on the file.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };