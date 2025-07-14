/**
 * Function to continue listing members of a group in Dropbox.
 *
 * @param {Object} args - Arguments for continuing the group members list.
 * @param {string} args.cursor - The cursor obtained from the previous call to paginate through members.
 * @returns {Promise<Object>} - The result of the group members list continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/members/list/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ cursor });

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
    console.error('Error continuing group members list:', error);
    return { error: 'An error occurred while continuing the group members list.' };
  }
};

/**
 * Tool configuration for continuing the group members list in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'continue_group_members_list',
      description: 'Continue listing members of a group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from the previous call to paginate through members.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };