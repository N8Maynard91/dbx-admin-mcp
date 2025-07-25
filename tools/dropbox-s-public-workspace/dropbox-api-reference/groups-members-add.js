/**
 * Function to add members to a Dropbox group.
 *
 * @param {Object} args - Arguments for adding members to a group.
 * @param {string} args.group_id - The ID of the group to which members will be added.
 * @param {Array<Object>} args.members - An array of members to be added, each containing user ID and access type.
 * @param {boolean} [args.return_members=true] - Whether to return the updated member list.
 * @returns {Promise<Object>} - The result of the add members operation.
 */
const executeFunction = async ({ group_id, members, return_members = true }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/add';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    group: {
      ".tag": "group_id",
      group_id: group_id
    },
    members: members,
    return_members: return_members
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
      body
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
    console.error('Error adding member to group:', error);
    return { error: 'An error occurred while adding member to group.', details: error.message };
  }
};

/**
 * Tool configuration for adding members to a Dropbox group.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_group_members',
      description: 'Add members to a Dropbox group.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to which members will be added.'
          },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    ".tag": {
                      type: 'string',
                      description: 'The tag indicating the user type.'
                    },
                    team_member_id: {
                      type: 'string',
                      description: 'The ID of the team member.'
                    }
                  },
                  required: ['.tag', 'team_member_id']
                },
                access_type: {
                  type: 'string',
                  description: 'The access type for the member.'
                }
              },
              required: ['user', 'access_type']
            },
            description: 'An array of members to be added.'
          },
          return_members: {
            type: 'boolean',
            description: 'Whether to return the updated member list.'
          }
        },
        required: ['group_id', 'members']
      }
    }
  }
};

export { apiTool };