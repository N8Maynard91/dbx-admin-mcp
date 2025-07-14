/**
 * Function to get the current user's account information from Dropbox.
 *
 * @returns {Promise<Object>} - The current user's account information.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/users/get_current_account';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting current account information:', error);
    return { error: 'An error occurred while getting current account information.' };
  }
};

/**
 * Tool configuration for getting current account information from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_current_account',
      description: 'Get information about the current user\'s account.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };