/**
 * Function to suspend a member in a Dropbox team.
 *
 * @param {Object} args - Arguments for suspending a member.
 * @param {string} args.team_member_identifier - The identifier type for the team member (e.g., email, user ID).
 * @param {string} args.team_member - The actual identifier value of the team member to be suspended.
 * @param {boolean} args.wipe_data - Indicates whether to wipe the member's data.
 * @returns {Promise<Object>} - The result of the suspend member operation.
 */
const executeFunction = async ({ team_member_identifier, team_member, wipe_data }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/suspend';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      '.tag': team_member_identifier,
      [team_member_identifier]: team_member
    },
    wipe_data: wipe_data
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_summary);
    }

    // Parse and return the response data
    const data = await response.text();
    return { message: data };
  } catch (error) {
    console.error('Error suspending member:', error);
    return { error: 'An error occurred while suspending the member.' };
  }
};

/**
 * Tool configuration for suspending a member in a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'suspend_member',
      description: 'Suspend a member in a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          team_member_identifier: {
            type: 'string',
            description: 'The identifier type for the team member (e.g., email, user ID).'
          },
          team_member: {
            type: 'string',
            description: 'The actual identifier value of the team member to be suspended.'
          },
          wipe_data: {
            type: 'boolean',
            description: 'Indicates whether to wipe the member\'s data.'
          }
        },
        required: ['team_member_identifier', 'team_member']
      }
    }
  }
};

export { apiTool };