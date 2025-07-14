/**
 * Function to update a legal hold policy in Dropbox.
 *
 * @param {Object} args - Arguments for the update policy.
 * @param {string} args.id - The ID of the legal hold policy to update.
 * @param {Array<string>} args.members - The list of team member IDs to include in the legal hold.
 * @returns {Promise<Object>} - The result of the update policy operation.
 */
const executeFunction = async ({ id, members }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/update_policy';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    id,
    members
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
    console.error('Error updating legal hold policy:', error);
    return { error: 'An error occurred while updating the legal hold policy.' };
  }
};

/**
 * Tool configuration for updating a legal hold policy in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_legal_hold_policy',
      description: 'Update a legal hold policy in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the legal hold policy to update.'
          },
          members: {
            type: 'array',
            items: {
              type: 'string',
              description: 'The list of team member IDs to include in the legal hold.'
            },
            description: 'The list of team member IDs to include in the legal hold.'
          }
        },
        required: ['id', 'members']
      }
    }
  }
};

export { apiTool };