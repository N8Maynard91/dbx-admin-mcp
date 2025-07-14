/**
 * Function to create a new group in Dropbox.
 *
 * @param {Object} args - Arguments for creating the group.
 * @param {string} args.group_name - The name of the group to create.
 * @param {boolean} [args.add_creator_as_owner=false] - Whether to add the creator as an owner of the group.
 * @param {string} [args.group_external_id] - An external ID for the group.
 * @returns {Promise<Object>} - The result of the group creation.
 */
const executeFunction = async ({ group_name, add_creator_as_owner = false, group_external_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/create';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    group_name,
    add_creator_as_owner,
    group_external_id
  });

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error creating group:', error);
    return { error: 'An error occurred while creating the group.' };
  }
};

/**
 * Tool configuration for creating a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_group',
      description: 'Create a new group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_name: {
            type: 'string',
            description: 'The name of the group to create.'
          },
          add_creator_as_owner: {
            type: 'boolean',
            description: 'Whether to add the creator as an owner of the group.'
          },
          group_external_id: {
            type: 'string',
            description: 'An external ID for the group.'
          }
        },
        required: ['group_name']
      }
    }
  }
};

export { apiTool };