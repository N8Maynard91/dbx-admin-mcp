/**
 * Function to archive a team folder in Dropbox.
 *
 * @param {Object} args - Arguments for archiving the team folder.
 * @param {string} args.team_folder_id - The ID of the team folder to archive.
 * @param {boolean} [args.force_async_off=false] - Whether to force the operation to be synchronous.
 * @returns {Promise<Object>} - The result of the archive operation.
 */
const executeFunction = async ({ team_folder_id, force_async_off = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/archive';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    team_folder_id,
    force_async_off
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
    console.error('Error archiving team folder:', error);
    return { error: 'An error occurred while archiving the team folder.' };
  }
};

/**
 * Tool configuration for archiving a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'archive_team_folder',
      description: 'Archive a team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_id: {
            type: 'string',
            description: 'The ID of the team folder to archive.'
          },
          force_async_off: {
            type: 'boolean',
            description: 'Whether to force the operation to be synchronous.'
          }
        },
        required: ['team_folder_id']
      }
    }
  }
};

export { apiTool };