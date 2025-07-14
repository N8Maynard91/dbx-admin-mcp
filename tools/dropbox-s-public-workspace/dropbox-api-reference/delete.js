/**
 * Function to delete a file or folder from Dropbox.
 *
 * @param {Object} args - Arguments for the delete operation.
 * @param {string} args.path - The path of the file or folder to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://api.dropboxapi.com/2/files/delete_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ path });

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
    console.error('Error deleting file or folder:', error);
    return { error: 'An error occurred while deleting the file or folder.' };
  }
};

/**
 * Tool configuration for deleting files or folders from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_file_or_folder',
      description: 'Delete a file or folder from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to delete.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };