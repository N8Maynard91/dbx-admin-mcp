/**
 * Function to create an OAuth 2.0 access token from the supplied OAuth 1.0 access token.
 *
 * @param {Object} args - Arguments for the token generation.
 * @param {string} args.oauth1_token - The OAuth 1.0 token.
 * @param {string} args.oauth1_token_secret - The OAuth 1.0 token secret.
 * @returns {Promise<Object>} - The result of the token generation.
 */
const executeFunction = async ({ oauth1_token, oauth1_token_secret }) => {
  const url = 'https://api.dropboxapi.com/2/auth/token/from_oauth1';
  const accessToken = ''; // will be provided by the user

  const body = JSON.stringify({
    oauth1_token,
    oauth1_token_secret
  });

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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
    console.error('Error generating OAuth 2.0 token:', error);
    return { error: 'An error occurred while generating the OAuth 2.0 token.' };
  }
};

/**
 * Tool configuration for generating an OAuth 2.0 access token from OAuth 1.0 token.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'token_from_oauth1',
      description: 'Creates an OAuth 2.0 access token from the supplied OAuth 1.0 access token.',
      parameters: {
        type: 'object',
        properties: {
          oauth1_token: {
            type: 'string',
            description: 'The OAuth 1.0 token.'
          },
          oauth1_token_secret: {
            type: 'string',
            description: 'The OAuth 1.0 token secret.'
          }
        },
        required: ['oauth1_token', 'oauth1_token_secret']
      }
    }
  }
};

export { apiTool };