/**
 * Function to get the current user's account information from Dropbox.
 *
 * @returns {Promise<Object>} - The current user's account information.
 */
const executeFunction = async ({ team_member_id } = {}) => {
  const url = 'https://api.dropboxapi.com/2/users/get_current_account';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  if (team_member_id) {
    headers['Dropbox-API-Select-User'] = team_member_id;
  }

  try {
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

    // Check if the response was successful
    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    // Parse and return the response data
    return data;
  } catch (error) {
    console.error('Error getting current account information:', error);
    return { error: 'An error occurred while getting current account information.', details: error.message };
  }
};

/**
 * Tool configuration for getting current account information from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_current_account',
      description: 'Get information about the current user\'s account.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The Dropbox team_member_id to act as (for Business tokens).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };