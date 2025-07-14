/**
 * Function to delete a group in Dropbox.
 *
 * @param {Object} args - Arguments for the delete group request.
 * @param {string} args.group_id - The ID of the group to be deleted.
 * @returns {Promise<Object>} - The result of the group deletion.
 */
const executeFunction = async ({ group_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/delete';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    ".tag": "group_id",
    group_id: group_id
  });

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

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting group:', error);
    return { error: 'An error occurred while deleting the group.' };
  }
};

/**
 * Tool configuration for deleting a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_group',
      description: 'Delete a group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'string',
            description: 'The ID of the group to be deleted.'
          }
        },
        required: ['group_id']
      }
    }
  }
};

export { apiTool };