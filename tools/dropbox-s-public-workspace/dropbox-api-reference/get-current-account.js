/**
 * Get the current account information for a Dropbox user or team member.
 * @param {string} [team_member_id] - Optional team member ID to act as (sets Dropbox-API-Select-User header).
 * @returns {Promise<Object>} - The current account info.
 */
const executeFunction = async ({ team_member_id } = {}) => {
  const url = 'https://api.dropboxapi.com/2/users/get_current_account';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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
    if (!response.ok) {
      if (typeof data === 'object' && data !== null && data.error && data.error['.tag'] === 'team_token') {
        return { error: 'This endpoint requires a user context. Provide a team_member_id to act as a specific user.' };
      }
      return { error: 'Dropbox API error', status: response.status, raw: text };
    }
    return data;
  } catch (err) {
    return { error: 'An error occurred while getting current account info.', details: err.message };
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