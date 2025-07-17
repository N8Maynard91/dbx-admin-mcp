/**
 * Function to export a file from a user's Dropbox.
 *
 * @param {Object} args - Arguments for the export.
 * @param {string} args.path - The path of the file to export in Dropbox.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the file export.
 */
const executeFunction = async ({ path, team_member_id }) => {
  const url = 'https://content.dropboxapi.com/2/files/export';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path })
    };
    if (team_member_id) {
      headers['Dropbox-API-Select-User'] = team_member_id;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error exporting file from Dropbox:', error);
    return { error: 'An error occurred while exporting the file.', details: error.message };
  }
};

/**
 * Tool configuration for exporting a file from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_file',
      description: 'Export a file from a user\'s Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to export in Dropbox.'
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