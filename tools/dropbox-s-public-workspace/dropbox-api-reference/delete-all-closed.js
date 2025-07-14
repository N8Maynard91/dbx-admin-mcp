/**
 * Function to delete all closed file requests in Dropbox.
 *
 * @returns {Promise<Object>} - The result of the delete operation.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/file_requests/delete_all_closed';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
    'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF',
    'Content-Type': 'application/json'
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting closed file requests:', error);
    return { error: 'An error occurred while deleting closed file requests.' };
  }
};

/**
 * Tool configuration for deleting all closed file requests in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_all_closed_file_requests',
      description: 'Delete all closed file requests owned by this user.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };