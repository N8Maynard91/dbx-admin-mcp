/**
 * Function to get file lock metadata for a list of paths in Dropbox.
 *
 * @param {Object} args - Arguments for the file lock batch request.
 * @param {Array<Object>} args.entries - An array of objects containing paths to the files.
 * @returns {Promise<Object>} - The result of the file lock batch request.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://api.dropboxapi.com/2/files/get_file_lock_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ entries });

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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
    console.error('Error getting file lock metadata:', error);
    return { error: 'An error occurred while getting file lock metadata.' };
  }
};

/**
 * Tool configuration for getting file lock metadata in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_file_lock_batch',
      description: 'Get file lock metadata for a list of paths in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'The path of the file to get lock metadata for.'
                }
              },
              required: ['path']
            },
            description: 'An array of objects containing paths to the files.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };