/**
 * Function to update sync settings on a team folder in Dropbox.
 *
 * @param {Object} args - Arguments for updating sync settings.
 * @param {string} args.team_folder_id - The ID of the team folder to update.
 * @param {string} args.sync_setting - The sync setting for the team folder.
 * @param {Array<Object>} args.content_sync_settings - An array of content sync settings.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ team_folder_id, sync_setting, content_sync_settings }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/update_sync_settings';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    team_folder_id,
    sync_setting,
    content_sync_settings
  };

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
      body: JSON.stringify(body)
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
    console.error('Error updating sync settings:', error);
    return { error: 'An error occurred while updating sync settings.' };
  }
};

/**
 * Tool configuration for updating sync settings on a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_sync_settings',
      description: 'Update sync settings on a team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_id: {
            type: 'string',
            description: 'The ID of the team folder to update.'
          },
          sync_setting: {
            type: 'string',
            description: 'The sync setting for the team folder.'
          },
          content_sync_settings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The ID of the content to update.'
                },
                sync_setting: {
                  type: 'string',
                  description: 'The sync setting for the content.'
                }
              },
              required: ['id', 'sync_setting']
            },
            description: 'An array of content sync settings.'
          }
        },
        required: ['team_folder_id', 'sync_setting', 'content_sync_settings']
      }
    }
  }
};

export { apiTool };