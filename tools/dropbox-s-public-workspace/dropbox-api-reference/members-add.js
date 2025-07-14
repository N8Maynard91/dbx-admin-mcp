/**
 * Function to add members to a Dropbox team.
 *
 * @param {Object} args - Arguments for adding members.
 * @param {Array} args.new_members - An array of new members to add.
 * @param {boolean} [args.force_async=false] - Whether to force the operation to be asynchronous.
 * @returns {Promise<Object>} - The result of the add members operation.
 */
const executeFunction = async ({ new_members, force_async = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/add';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    new_members,
    force_async
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
    console.error('Error adding members to team:', error);
    return { error: 'An error occurred while adding members to the team.' };
  }
};

/**
 * Tool configuration for adding members to a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_members',
      description: 'Add members to a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          new_members: {
            type: 'array',
            description: 'An array of new members to add, each containing member details.'
          },
          force_async: {
            type: 'boolean',
            description: 'Whether to force the operation to be asynchronous.'
          }
        },
        required: ['new_members']
      }
    }
  }
};

export { apiTool };