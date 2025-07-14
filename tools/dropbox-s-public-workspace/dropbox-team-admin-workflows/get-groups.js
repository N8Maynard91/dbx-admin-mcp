/**
 * Function to get groups from Dropbox Team.
 *
 * @param {Object} args - Arguments for the group retrieval.
 * @param {number} [args.limit=100] - The maximum number of groups to return.
 * @returns {Promise<Object>} - The result of the group retrieval.
 */
const executeFunction = async ({ limit = 100 }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  
  try {
    // Prepare the request body
    const body = JSON.stringify({ limit });

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
    console.error('Error retrieving groups:', error);
    return { error: 'An error occurred while retrieving groups.' };
  }
};

/**
 * Tool configuration for retrieving groups from Dropbox Team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_groups',
      description: 'Retrieve groups from Dropbox Team.',
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