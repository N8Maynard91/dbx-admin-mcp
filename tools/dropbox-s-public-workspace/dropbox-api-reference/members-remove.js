/**
 * Function to remove a member from a Dropbox team.
 *
 * @param {Object} args - Arguments for the member removal.
 * @param {string} args.team_member_id - The ID of the team member to be removed. (required)
 * @param {boolean} [args.wipe_data=true] - Whether to wipe the member's data.
 * @param {boolean} [args.keep_account=false] - Whether to keep the member's account.
 * @param {boolean} [args.retain_team_shares=false] - Whether to retain team shares.
 * @param {string} [args.transfer_dest_id] - The team_member_id of the destination user to receive files (optional, but if provided, transfer_admin_id is required).
 * @param {string} [args.transfer_admin_id] - The team_member_id of the admin to receive error notifications (required if transfer_dest_id is provided).
 * @returns {Promise<Object>} - The result of the member removal.
 */
import { apiTool as membersGetInfoTool } from './members-get-info.js';
const membersGetInfo = membersGetInfoTool.function;

const executeFunction = async (args) => {
  let { team_member_id, transfer_dest_id, transfer_admin_id, wipe_data = true, keep_account = false, retain_team_shares = false } = args;

  if (!team_member_id) {
    return { error: 'team_member_id is required. If you only have an email or account_id, use the members-get-info tool to resolve it first.' };
  }

  // If transfer_dest_id is provided, transfer_admin_id must also be provided
  if (transfer_dest_id && !transfer_admin_id) {
    return { error: 'If transfer_dest_id is provided, transfer_admin_id is also required.' };
  }

  // Format transfer_dest_id and transfer_admin_id as UserSelectorArg objects if provided
  let transfer_dest = undefined;
  let transfer_admin = undefined;
  if (transfer_dest_id) {
    transfer_dest = { '.tag': 'team_member_id', team_member_id: transfer_dest_id };
  }
  if (transfer_admin_id) {
    transfer_admin = { '.tag': 'team_member_id', team_member_id: transfer_admin_id };
  }

  // Build the request body
  const body = {
    user: { '.tag': 'team_member_id', team_member_id },
    wipe_data,
    keep_account,
    retain_team_shares
  };
  if (transfer_dest) body.transfer_dest_id = transfer_dest;
  if (transfer_admin) body.transfer_admin_id = transfer_admin;

  // Make the API call
  const url = 'https://api.dropboxapi.com/2/team/members/remove';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    if (!response.ok) {
      // Handle specific Dropbox error tags
      if (typeof data === 'object' && data !== null && data.error && data.error['.tag']) {
        if (data.error['.tag'] === 'removed_and_transfer_dest_should_differ') {
          return { error: 'The user being removed and the transfer destination must be different users.' };
        }
        if (data.error['.tag'] === 'user_not_found') {
          return { error: 'The specified user was not found.' };
        }
      }
      return { error: 'Dropbox API error', status: response.status, raw: text };
    }
    return data;
  } catch (err) {
    return { error: 'An error occurred while removing the member.', details: err.message };
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