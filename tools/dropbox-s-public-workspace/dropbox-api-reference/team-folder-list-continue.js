/**
 * Function to continue listing team folders in Dropbox.
 *
 * @param {Object} args - Arguments for continuing the team folder listing.
 * @param {string} args.cursor - The cursor obtained from the previous `team_folder/list` call.
 * @returns {Promise<Object>} - The result of the team folder listing continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/list/continue';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Prepare the request body
    const body = JSON.stringify({ cursor });

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
    console.error('Error continuing team folder listing:', error);
    return { error: 'An error occurred while continuing the team folder listing.' };
  }
};

/**
 * Tool configuration for continuing the team folder listing in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'team_folder_list_continue',
      description: 'Continue listing team folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from the previous `team_folder/list` call.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };