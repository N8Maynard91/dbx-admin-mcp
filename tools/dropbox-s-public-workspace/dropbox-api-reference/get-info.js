/**
 * Function to retrieve information about a team from Dropbox.
 *
 * @returns {Promise<Object>} - The result of the team information retrieval.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/team/get_info';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

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
    console.error('Error retrieving team information:', error);
    return { error: 'An error occurred while retrieving team information.' };
  }
};

/**
 * Tool configuration for retrieving team information from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_info',
      description: 'Retrieve information about a team from Dropbox.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };