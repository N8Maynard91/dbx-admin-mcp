/**
 * Function to count the total number of file requests owned by the user.
 *
 * @returns {Promise<Object>} - The response containing the file request count.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/file_requests/count';
  const accessToken = ''; // will be provided by the user

  // Set up headers for the request
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error counting file requests:', error);
    return { error: 'An error occurred while counting file requests.' };
  }
};

/**
 * Tool configuration for counting file requests on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'count_file_requests',
      description: 'Count the total number of file requests owned by the user.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };