/**
 * Function to check user authentication with Dropbox API.
 *
 * @param {Object} args - Arguments for the user check.
 * @param {string} args.query - The query string to validate the access token.
 * @returns {Promise<Object>} - The result of the user check.
 */
const executeFunction = async ({ query }) => {
  const url = 'https://api.dropboxapi.com/2/check/user';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ query });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return { error: 'An error occurred while checking user authentication.' };
  }
};

/**
 * Tool configuration for checking user authentication with Dropbox API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_user',
      description: 'Check user authentication with Dropbox API.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The query string to validate the access token.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };