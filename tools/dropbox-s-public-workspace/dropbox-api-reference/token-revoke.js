/**
 * Function to revoke an access token in Dropbox.
 *
 * @returns {Promise<Object>} - The result of the token revoke operation.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/auth/token/revoke';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
    'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF'
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error('Error revoking token:', error);
    return { error: 'An error occurred while revoking the token.' };
  }
};

/**
 * Tool configuration for revoking an access token in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'revoke_token',
      description: 'Revokes an access token in Dropbox.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };