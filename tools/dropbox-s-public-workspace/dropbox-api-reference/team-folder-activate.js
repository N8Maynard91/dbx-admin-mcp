/**
 * Function to activate a team folder in Dropbox.
 *
 * @param {Object} args - Arguments for activating the team folder.
 * @param {string} args.team_folder_id - The ID of the team folder to activate.
 * @returns {Promise<Object>} - The result of the team folder activation.
 */
const executeFunction = async ({ team_folder_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/team_folder/activate';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ team_folder_id });

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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    return data;
  } catch (error) {
    console.error('Error activating team folder:', error);
    return { error: 'An error occurred while activating the team folder.' };
  }
};

/**
 * Tool configuration for activating a team folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'activate_team_folder',
      description: 'Activate a team folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_folder_id: {
            type: 'string',
            description: 'The ID of the team folder to activate.'
          }
        },
        required: ['team_folder_id']
      }
    }
  }
};

export { apiTool };