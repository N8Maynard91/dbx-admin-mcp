/**
 * Function to retrieve metadata for team folders in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {Array<string>} args.team_folder_ids - An array of team folder IDs to retrieve information for.
 * @returns {Promise<Object>} - The result of the team folder metadata retrieval.
 */
const executeFunction = async ({ team_folder_ids }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/get_info';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ team_folder_ids });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
    console.error('Error retrieving team folder info:', error);
    return { error: 'An error occurred while retrieving team folder info.' };
  }
};

/**
 * Tool configuration for retrieving team folder metadata in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'team_folder_get_info',
      description: 'Retrieve metadata for team folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of team folder IDs to retrieve information for.'
          }
        },
        required: ['team_folder_ids']
      }
    }
  }
};

export { apiTool };