/**
 * Function to perform App Authentication with Dropbox API.
 *
 * @param {Object} args - Arguments for the app authentication.
 * @param {string} args.query - The query string to validate the app.
 * @returns {Promise<Object>} - The result of the app authentication.
 */
const executeFunction = async ({ query }) => {
  const url = 'https://api.dropboxapi.com/2/check/app';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  // Prepare the request body
  const body = JSON.stringify({ query });

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
    console.error('Error during app authentication:', error);
    return { error: 'An error occurred during app authentication.' };
  }
};

/**
 * Tool configuration for performing App Authentication with Dropbox API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_app',
      description: 'Perform App Authentication with Dropbox API.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The query string to validate the app.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };