/**
 * Function to remove a member from a Dropbox team.
 *
 * @param {Object} args - Arguments for the member removal.
 * @param {string} args.team_member - The identifier of the team member to be removed.
 * @param {string} args.team_member_identifier - The type of identifier for the team member (e.g., "email").
 * @param {boolean} args.wipe_data - Whether to wipe the user's data.
 * @param {string} args.dest_team_member - The identifier of the destination team member for data transfer.
 * @param {string} args.dest_member_identifier - The type of identifier for the destination member (e.g., "email").
 * @param {string} args.transfer_admin - The identifier of the admin transferring data.
 * @param {string} args.transfer_admin_identifier - The type of identifier for the transfer admin (e.g., "email").
 * @param {boolean} args.keep_account - Whether to keep the account.
 * @param {boolean} args.retain_team_shares - Whether to retain team shares.
 * @returns {Promise<Object>} - The result of the member removal operation.
 */
const executeFunction = async ({ team_member, team_member_identifier, wipe_data, dest_team_member, dest_member_identifier, transfer_admin, transfer_admin_identifier, keep_account, retain_team_shares }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/remove';
  const accessToken = ''; // will be provided by the user

  const requestBody = {
    user: {
      '.tag': team_member_identifier,
      [team_member_identifier]: team_member
    },
    wipe_data,
    transfer_dest_id: {
      '.tag': dest_member_identifier,
      [dest_member_identifier]: dest_team_member
    },
    transfer_admin_id: {
      '.tag': transfer_admin_identifier,
      [transfer_admin_identifier]: transfer_admin
    },
    keep_account,
    retain_team_shares
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
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
    console.error('Error removing member:', error);
    return { error: 'An error occurred while removing the member.', details: error.message };
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
          team_member: {
            type: 'string',
            description: 'The identifier of the team member to be removed.'
          },
          team_member_identifier: {
            type: 'string',
            description: 'The type of identifier for the team member (e.g., "email").'
          },
          wipe_data: {
            type: 'boolean',
            description: 'Whether to wipe the user\'s data.'
          },
          dest_team_member: {
            type: 'string',
            description: 'The identifier of the destination team member for data transfer.'
          },
          dest_member_identifier: {
            type: 'string',
            description: 'The type of identifier for the destination member (e.g., "email").'
          },
          transfer_admin: {
            type: 'string',
            description: 'The identifier of the admin transferring data.'
          },
          transfer_admin_identifier: {
            type: 'string',
            description: 'The type of identifier for the transfer admin (e.g., "email").'
          },
          keep_account: {
            type: 'boolean',
            description: 'Whether to keep the account.'
          },
          retain_team_shares: {
            type: 'boolean',
            description: 'Whether to retain team shares.'
          }
        },
        required: ['team_member', 'team_member_identifier']
      }
    }
  }
};

export { apiTool };