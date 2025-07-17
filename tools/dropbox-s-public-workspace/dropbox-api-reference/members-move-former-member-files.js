/**
 * Function to move files of a former member to a different member in Dropbox.
 *
 * @param {Object} args - Arguments for moving former member files.
 * @param {string} args.userId - The team member ID of the user whose files are to be moved.
 * @param {string} args.transferDestId - The team member ID to whom the files will be transferred.
 * @param {string} args.transferAdminId - The team member ID of the admin initiating the transfer.
 * @returns {Promise<Object>} - The result of the file transfer operation.
 */
const executeFunction = async ({ userId, transferDestId, transferAdminId, userStatus }) => {
  if (!userId || !transferDestId || !transferAdminId) {
    return { error: 'userId, transferDestId, and transferAdminId (all as team_member_id strings) are required.' };
  }
  if (userStatus && userStatus !== 'removed') {
    return { error: 'User must be fully removed from the team before moving their files.' };
  }
  const url = 'https://api.dropboxapi.com/2/team/members/move_former_member_files';
  const accessToken = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    user: {
      ".tag": "team_member_id",
      team_member_id: userId
    },
    transfer_dest_id: {
      ".tag": "team_member_id",
      team_member_id: transferDestId
    },
    transfer_admin_id: {
      ".tag": "team_member_id",
      team_member_id: transferAdminId
    }
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
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
    console.error('Error moving former member files:', error);
    return { error: 'An error occurred while moving former member files.', details: error.message };
  }
};

/**
 * Tool configuration for moving former member files in Dropbox.
 * @param {string} userId - The team_member_id of the user whose files are to be moved. (required)
 * @param {string} transferDestId - The team_member_id to whom the files will be transferred. (required)
 * @param {string} transferAdminId - The team_member_id of the admin initiating the transfer. (required)
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'move_former_member_files',
      description: 'Move files of a former member to a different member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The team member ID of the user whose files are to be moved.'
          },
          transferDestId: {
            type: 'string',
            description: 'The team member ID to whom the files will be transferred.'
          },
          transferAdminId: {
            type: 'string',
            description: 'The team member ID of the admin initiating the transfer.'
          }
        },
        required: ['userId', 'transferDestId', 'transferAdminId']
      }
    }
  }
};

export { apiTool };