/**
 * Function to create a folder in Dropbox.
 *
 * @param {Object} args - Arguments for creating the folder.
 * @param {string} args.path - The path where the folder will be created.
 * @param {boolean} [args.autorename=false] - Whether to automatically rename the folder if it already exists.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the folder creation.
 */
const executeFunction = async ({ path, autorename = true, team_member_id }) => {
  if (!team_member_id) {
    return { error: 'team_member_id is required for user file operations. Please provide the team_member_id to act as.' };
  }
  const url = 'https://api.dropboxapi.com/2/files/create_folder_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  headers['Dropbox-API-Select-User'] = team_member_id;

  const body = JSON.stringify({
    path,
    autorename
  });

  try {
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
    console.error('Error creating folder:', error);
    return { error: 'An error occurred while creating the folder.', details: error.message };
  }
};

/**
 * Tool configuration for creating a folder in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_folder',
      description: 'Create a folder in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path where the folder will be created.'
          },
          autorename: {
            type: 'boolean',
            description: 'Whether to automatically rename the folder if it already exists.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };