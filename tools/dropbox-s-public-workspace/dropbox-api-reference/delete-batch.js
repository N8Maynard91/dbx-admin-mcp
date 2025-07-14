/**
 * Function to delete multiple files or folders in Dropbox.
 *
 * @param {Object} args - Arguments for the delete batch operation.
 * @param {Array<Object>} args.entries - An array of entries to delete, each containing a path.
 * @returns {Promise<Object>} - The result of the delete batch operation.
 */
const executeFunction = async ({ entries }) => {
  const url = 'https://api.dropboxapi.com/2/files/delete_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Prepare the request body
  const body = JSON.stringify({ entries });

  // Set up headers for the request
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
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
    console.error('Error deleting files:', error);
    return { error: 'An error occurred while deleting files.' };
  }
};

/**
 * Tool configuration for deleting files in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_batch',
      description: 'Delete multiple files or folders in Dropbox.',
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
                  description: 'The path of the file or folder to delete.'
                }
              },
              required: ['path']
            },
            description: 'An array of entries to delete.'
          }
        },
        required: ['entries']
      }
    }
  }
};

export { apiTool };