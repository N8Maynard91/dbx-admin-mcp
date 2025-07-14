/**
 * Function to list all linked applications of a team member in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.team_member_id - The ID of the team member whose linked applications are to be listed.
 * @returns {Promise<Object>} - The result of the linked applications request.
 */
const executeFunction = async ({ team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/linked_apps/list_member_linked_apps';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ team_member_id });

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
    console.error('Error listing linked applications:', error);
    return { error: 'An error occurred while listing linked applications.' };
  }
};

/**
 * Tool configuration for listing linked applications of a team member in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_member_linked_apps',
      description: 'List all linked applications of a team member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member whose linked applications are to be listed.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };