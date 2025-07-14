/**
 * Function to list team folders in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=100] - The maximum number of team folders to return.
 * @returns {Promise<Object>} - The response containing the list of team folders.
 */
const executeFunction = async ({ limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/list';
  const accessToken = ''; // will be provided by the user

  try {
    // Prepare the request body
    const body = JSON.stringify({ limit });

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
    console.error('Error listing team folders:', error);
    return { error: 'An error occurred while listing team folders.' };
  }
};

/**
 * Tool configuration for listing team folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_team_folders',
      description: 'List all team folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of team folders to return.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };