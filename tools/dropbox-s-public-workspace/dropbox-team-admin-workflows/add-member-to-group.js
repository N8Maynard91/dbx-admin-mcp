/**
 * Function to add a member to a group in Dropbox.
 *
 * @param {Object} args - Arguments for adding a member to a group.
 * @param {string} args.group_id - The ID of the group to which the member will be added.
 * @param {string} args.team_member_id - The ID of the team member to be added.
 * @returns {Promise<Object>} - The result of the add member operation.
 */
const executeFunction = async ({ group_id, team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/add';
  const accessToken = ''; // will be provided by the user

  const body = {
    group: {
      ".tag": "group_id",
      group_id: group_id
    },
    members: [
      {
        user: {
          ".tag": "team_member_id",
          team_member_id: team_member_id
        },
        access_type: "member"
      }
    ],
    return_members: true
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
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
    console.error('Error adding member to group:', error);
    return { error: 'An error occurred while adding the member to the group.' };
  }
};

/**
 * Tool configuration for adding a member to a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_member_to_group',
      description: 'Add a member to a group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to which the member will be added.'
          },
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to be added.'
          }
        },
        required: ['group_id', 'team_member_id']
      }
    }
  }
};

export { apiTool };