/**
 * Function to list legal hold policies on a Dropbox team.
 *
 * @param {Object} args - Arguments for the request.
 * @param {boolean} [args.include_released=false] - Whether to include released policies in the response.
 * @returns {Promise<Object>} - The result of the legal holds list policies request.
 */
const executeFunction = async ({ include_released = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/list_policies';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Prepare the request body
    const body = JSON.stringify({ include_released });

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
    console.error('Error listing legal hold policies:', error);
    return { error: 'An error occurred while listing legal hold policies.' };
  }
};

/**
 * Tool configuration for listing legal hold policies on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_legal_holds',
      description: 'List legal hold policies on a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          include_released: {
            type: 'boolean',
            description: 'Whether to include released policies in the response.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };