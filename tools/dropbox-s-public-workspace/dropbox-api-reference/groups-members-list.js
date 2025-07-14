/**
 * Function to list members of a group in Dropbox.
 *
 * @param {Object} args - Arguments for the group members list.
 * @param {string} args.group_id - The ID of the group to list members from.
 * @param {number} [args.limit=100] - The maximum number of members to return.
 * @returns {Promise<Object>} - The result of the group members list request.
 */
const executeFunction = async ({ group_id, limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    group: {
      '.tag': 'group_id',
      group_id: group_id
    },
    limit: limit
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
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
    console.error('Error listing group members:', error);
    return { error: 'An error occurred while listing group members.' };
  }
};

/**
 * Tool configuration for listing members of a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_group_members',
      description: 'List members of a group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to list members from.'
          },
          limit: {
            type: 'integer',
            description: 'The maximum number of members to return.'
          }
        },
        required: ['group_id']
      }
    }
  }
};

export { apiTool };