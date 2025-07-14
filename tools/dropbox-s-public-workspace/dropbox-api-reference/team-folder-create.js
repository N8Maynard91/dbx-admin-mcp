/**
 * Function to create a new team folder in Dropbox.
 *
 * @param {Object} args - Arguments for creating the team folder.
 * @param {string} args.name - The name of the team folder to create.
 * @param {string} [args.sync_setting="not_synced"] - The sync setting for the team folder.
 * @returns {Promise<Object>} - The result of the team folder creation.
 */
const executeFunction = async ({ name, sync_setting = 'not_synced' }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/create';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    name,
    sync_setting
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
    console.error('Error creating team folder:', error);
    return { error: 'An error occurred while creating the team folder.' };
  }
};

/**
 * Tool configuration for creating a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_team_folder',
      description: 'Create a new team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the team folder to create.'
          },
          sync_setting: {
            type: 'string',
            description: 'The sync setting for the team folder.'
          }
        },
        required: ['name']
      }
    }
  }
};

export { apiTool };