/**
 * Function to remove members from a Dropbox group.
 *
 * @param {Object} args - Arguments for removing members from a group.
 * @param {string} args.group_id - The ID of the group from which to remove members.
 * @param {Array<Object>} args.users - An array of user objects to be removed, each containing a team_member_id.
 * @param {boolean} [args.return_members=true] - Whether to return the remaining members of the group.
 * @returns {Promise<Object>} - The result of the remove members operation.
 */
const executeFunction = async ({ group_id, users, return_members = true }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/remove';
  const accessToken = ''; // will be provided by the user

  const body = {
    group: {
      ".tag": "group_id",
      group_id: group_id
    },
    users: users,
    return_members: return_members
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
    console.error('Error removing members from group:', error);
    return { error: 'An error occurred while removing members from the group.' };
  }
};

/**
 * Tool configuration for removing members from a Dropbox group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_group_members',
      description: 'Remove members from a Dropbox group.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group from which to remove members.'
          },
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                team_member_id: {
                  type: 'string',
                  description: 'The ID of the team member to be removed.'
                }
              },
              required: ['team_member_id']
            },
            description: 'An array of user objects to be removed.'
          },
          return_members: {
            type: 'boolean',
            description: 'Whether to return the remaining members of the group.'
          }
        },
        required: ['group_id', 'users']
      }
    }
  }
};

export { apiTool };