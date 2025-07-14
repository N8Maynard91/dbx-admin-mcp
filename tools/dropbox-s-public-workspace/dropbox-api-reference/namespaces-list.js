/**
 * Function to list team-accessible namespaces in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=1] - The maximum number of namespaces to return.
 * @returns {Promise<Object>} - The response containing the list of namespaces.
 */
const executeFunction = async ({ limit = 1 }) => {
  const url = 'https://api.dropboxapi.com/2/team/namespaces/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ limit });

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
    console.error('Error listing namespaces:', error);
    return { error: 'An error occurred while listing namespaces.' };
  }
};

/**
 * Tool configuration for listing namespaces in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_namespaces',
      description: 'List team-accessible namespaces in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of namespaces to return.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };