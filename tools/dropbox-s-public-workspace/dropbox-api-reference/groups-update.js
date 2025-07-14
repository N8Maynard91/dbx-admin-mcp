/**
 * Function to update a group's name and/or external ID in Dropbox.
 *
 * @param {Object} args - Arguments for the group update.
 * @param {string} args.group_id - The ID of the group to update.
 * @param {string} args.new_group_name - The new name for the group.
 * @param {string} args.new_group_external_id - The new external ID for the group.
 * @param {string} args.new_group_management_type - The management type for the group.
 * @param {boolean} [args.return_members=true] - Whether to return the members of the group.
 * @returns {Promise<Object>} - The result of the group update.
 */
const executeFunction = async ({ group_id, new_group_name, new_group_external_id, new_group_management_type, return_members = true }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/update';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    group: {
      ".tag": "group_id",
      group_id: group_id
    },
    return_members: return_members,
    new_group_name: new_group_name,
    new_group_external_id: new_group_external_id,
    new_group_management_type: new_group_management_type
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
    console.error('Error updating group:', error);
    return { error: 'An error occurred while updating the group.' };
  }
};

/**
 * Tool configuration for updating a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_group',
      description: 'Update a group\'s name and/or external ID in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to update.'
          },
          new_group_name: {
            type: 'string',
            description: 'The new name for the group.'
          },
          new_group_external_id: {
            type: 'string',
            description: 'The new external ID for the group.'
          },
          new_group_management_type: {
            type: 'string',
            description: 'The management type for the group.'
          },
          return_members: {
            type: 'boolean',
            description: 'Whether to return the members of the group.'
          }
        },
        required: ['group_id', 'new_group_name', 'new_group_external_id', 'new_group_management_type']
      }
    }
  }
};

export { apiTool };