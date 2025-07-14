/**
 * Function to rename a team folder in Dropbox.
 *
 * @param {Object} args - Arguments for renaming the team folder.
 * @param {string} args.team_folder_id - The ID of the team folder to rename.
 * @param {string} args.name - The new name for the team folder.
 * @returns {Promise<Object>} - The result of the team folder rename operation.
 */
const executeFunction = async ({ team_folder_id, name }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/rename';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    team_folder_id,
    name
  });

  try {
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
    console.error('Error renaming team folder:', error);
    return { error: 'An error occurred while renaming the team folder.' };
  }
};

/**
 * Tool configuration for renaming a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'rename_team_folder',
      description: 'Rename a team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_id: {
            type: 'string',
            description: 'The ID of the team folder to rename.'
          },
          name: {
            type: 'string',
            description: 'The new name for the team folder.'
          }
        },
        required: ['team_folder_id', 'name']
      }
    }
  }
};

export { apiTool };