/**
 * Function to revoke a shared link on Dropbox.
 *
 * @param {Object} args - Arguments for revoking the shared link.
 * @param {string} args.url - The URL of the shared link to revoke.
 * @returns {Promise<Object>} - The result of the revoke shared link operation.
 */
const executeFunction = async ({ url }) => {
  const accessToken = ''; // will be provided by the user
  const apiUrl = 'https://api.dropboxapi.com/2/sharing/revoke_shared_link';

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Prepare the request body
    const body = JSON.stringify({ url });

    // Perform the fetch request
    const response = await fetch(apiUrl, {
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
    console.error('Error revoking shared link:', error);
    return { error: 'An error occurred while revoking the shared link.' };
  }
};

/**
 * Tool configuration for revoking a shared link on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'revoke_shared_link',
      description: 'Revoke a shared link on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the shared link to revoke.'
          }
        },
        required: ['url']
      }
    }
  }
};

export { apiTool };