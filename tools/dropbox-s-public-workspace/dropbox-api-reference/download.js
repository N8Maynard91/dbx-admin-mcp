/**
 * Function to download a file from Dropbox.
 *
 * @param {Object} args - Arguments for the download.
 * @param {string} args.path - The path of the file to download from Dropbox.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the file download.
 */
const executeFunction = async ({ path, team_member_id }) => {
  const url = 'https://content.dropboxapi.com/2/files/download';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Arg': JSON.stringify({ path })
  };
  if (team_member_id) {
    headers['Dropbox-API-Select-User'] = team_member_id;
  }

  try {
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
    console.error('Error downloading file from Dropbox:', error);
    return { error: 'An error occurred while downloading the file.', details: error.message };
  }
};

/**
 * Tool configuration for downloading files from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'download_file',
      description: 'Download a file from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path of the file to download from Dropbox.'
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