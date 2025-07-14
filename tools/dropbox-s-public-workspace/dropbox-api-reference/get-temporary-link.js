/**
 * Function to get a temporary link for a file in Dropbox.
 *
 * @param {Object} args - Arguments for the temporary link request.
 * @param {string} args.path - The path of the file for which to get the temporary link.
 * @returns {Promise<Object>} - The result of the temporary link request.
 */
const executeFunction = async ({ path }) => {
  const url = 'https://api.dropboxapi.com/2/files/get_temporary_link';
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
    console.error('Error getting temporary link:', error);
    return { error: 'An error occurred while getting the temporary link.' };
  }
};

/**
 * Tool configuration for getting a temporary link for a file in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_temporary_link',
      description: 'Get a temporary link for a file in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file for which to get the temporary link.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };