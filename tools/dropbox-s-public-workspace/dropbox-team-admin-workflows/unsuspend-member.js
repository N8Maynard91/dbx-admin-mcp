/**
 * Function to unsuspend a member in a Dropbox team.
 *
 * @param {Object} args - Arguments for the unsuspend operation.
 * @param {string} args.team_member_identifier - The identifier type for the team member (e.g., email or user ID).
 * @param {string} args.team_member - The actual identifier value of the team member to be unsuspended.
 * @returns {Promise<Object>} - The result of the unsuspend operation.
 */
const executeFunction = async ({ team_member_identifier, team_member }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/unsuspend';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const data = {
    user: {
      '.tag': team_member_identifier,
      [team_member_identifier]: team_member
    }
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
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
    console.error('Error unsuspending member:', error);
    return { error: 'An error occurred while unsuspending the member.', details: error.message };
  }
};

/**
 * Tool configuration for unsuspending a member in a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'unsuspend_member',
      description: 'Unsuspend a member in a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          team_member_identifier: {
            type: 'string',
            description: 'The identifier type for the team member (e.g., email or user ID).'
          },
          team_member: {
            type: 'string',
            description: 'The actual identifier value of the team member to be unsuspended.'
          }
        },
        required: ['team_member_identifier', 'team_member']
      }
    }
  }
};

export { apiTool };