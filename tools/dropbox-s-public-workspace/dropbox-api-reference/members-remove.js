/**
 * Function to remove a member from a Dropbox team.
 *
 * @param {Object} args - Arguments for the member removal.
 * @param {string} args.team_member_id - The ID of the team member to be removed.
 * @param {boolean} [args.wipe_data=true] - Whether to wipe the member's data.
 * @param {boolean} [args.keep_account=false] - Whether to keep the member's account.
 * @param {boolean} [args.retain_team_shares=false] - Whether to retain team shares.
 * @returns {Promise<Object>} - The result of the member removal.
 */
const executeFunction = async ({ team_member_id, wipe_data = true, keep_account = false, retain_team_shares = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/remove';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      ".tag": "team_member_id",
      team_member_id
    },
    wipe_data,
    transfer_dest_id: {
      ".tag": "team_member_id",
      team_member_id
    },
    transfer_admin_id: {
      ".tag": "team_member_id",
      team_member_id
    },
    keep_account,
    retain_team_shares
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing member from team:', error);
    return { error: 'An error occurred while removing the member from the team.' };
  }
};

/**
 * Tool configuration for removing a member from a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_member',
      description: 'Remove a member from a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to be removed.'
          },
          wipe_data: {
            type: 'boolean',
            description: 'Whether to wipe the member\'s data.'
          },
          keep_account: {
            type: 'boolean',
            description: 'Whether to keep the member\'s account.'
          },
          retain_team_shares: {
            type: 'boolean',
            description: 'Whether to retain team shares.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };