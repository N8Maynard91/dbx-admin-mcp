/**
 * Function to list templates for a team in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @returns {Promise<Object>} - The response containing template identifiers for the team.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/file_properties/templates/list_for_team';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
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
    console.error('Error listing templates for team:', error);
    return { error: 'An error occurred while listing templates for the team.' };
  }
};

/**
 * Tool configuration for listing templates for a team in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_templates_for_team',
      description: 'List template identifiers for a team in Dropbox.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };