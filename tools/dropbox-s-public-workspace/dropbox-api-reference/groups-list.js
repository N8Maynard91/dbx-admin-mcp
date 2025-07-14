/**
 * Function to list groups on a Dropbox team.
 *
 * @param {Object} args - Arguments for the group listing.
 * @param {number} [args.limit=100] - The maximum number of groups to return.
 * @returns {Promise<Object>} - The result of the groups listing.
 */
const executeFunction = async ({ limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ limit });

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
    console.error('Error listing groups:', error);
    return { error: 'An error occurred while listing groups.' };
  }
};

/**
 * Tool configuration for listing groups on a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_groups',
      description: 'List groups on a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of groups to return.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };