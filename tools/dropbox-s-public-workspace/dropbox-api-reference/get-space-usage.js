/**
 * Function to get space usage information for the current user's Dropbox account.
 *
 * @returns {Promise<Object>} - The space usage information including used space and allocation details.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/users/get_space_usage';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
    'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting space usage:', error);
    return { error: 'An error occurred while getting space usage.' };
  }
};

/**
 * Tool configuration for getting space usage on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_space_usage',
      description: 'Get the space usage information for the current user\'s Dropbox account.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };