/**
 * Function to move files of a former member to a different member in Dropbox.
 *
 * @param {Object} args - Arguments for moving former member files.
 * @param {string} args.userId - The team member ID of the user whose files are to be moved.
 * @param {string} args.transferDestId - The team member ID to whom the files will be transferred.
 * @param {string} args.transferAdminId - The team member ID of the admin initiating the transfer.
 * @returns {Promise<Object>} - The result of the file transfer operation.
 */
const executeFunction = async ({ userId, transferDestId, transferAdminId }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/move_former_member_files';
  const accessToken = ''; // will be provided by the user

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

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving former member files:', error);
    return { error: 'An error occurred while moving former member files.' };
  }
};

/**
 * Tool configuration for moving former member files in Dropbox.
 * @type {Object}
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