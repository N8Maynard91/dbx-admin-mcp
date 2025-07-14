/**
 * Function to relinquish file membership in Dropbox.
 *
 * @param {Object} args - Arguments for relinquishing file membership.
 * @param {string} args.file - The ID of the file to relinquish membership from.
 * @returns {Promise<Object>} - The result of the relinquish file membership operation.
 */
const executeFunction = async ({ file }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/relinquish_file_membership';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ file });

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
    console.error('Error relinquishing file membership:', error);
    return { error: 'An error occurred while relinquishing file membership.' };
  }
};

/**
 * Tool configuration for relinquishing file membership in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'relinquish_file_membership',
      description: 'Relinquish membership in a designated file on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The ID of the file to relinquish membership from.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };