/**
 * Function to permanently delete a file or folder in Dropbox.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.path - The path of the file or folder to be permanently deleted.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://api.dropboxapi.com/2/files/permanently_delete';
  const accessToken = ''; // will be provided by the user

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const body = JSON.stringify({ path });

  try {
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
    return await response.json();
  } catch (error) {
    console.error('Error permanently deleting the file:', error);
    return { error: 'An error occurred while permanently deleting the file.' };
  }
};

/**
 * Tool configuration for permanently deleting a file or folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'permanently_delete',
      description: 'Permanently delete a file or folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file or folder to be permanently deleted.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };