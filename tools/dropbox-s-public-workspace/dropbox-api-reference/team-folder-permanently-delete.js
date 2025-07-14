/**
 * Function to permanently delete an archived team folder in Dropbox.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.team_folder_id - The ID of the team folder to be permanently deleted.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ team_folder_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/permanently_delete';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({ team_folder_id });

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
    console.error('Error permanently deleting team folder:', error);
    return { error: 'An error occurred while permanently deleting the team folder.' };
  }
};

/**
 * Tool configuration for permanently deleting a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'team_folder_permanently_delete',
      description: 'Permanently delete an archived team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_id: {
            type: 'string',
            description: 'The ID of the team folder to be permanently deleted.'
          }
        },
        required: ['team_folder_id']
      }
    }
  }
};

export { apiTool };