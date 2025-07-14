/**
 * Function to list mountable folders in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=100] - The maximum number of folders to return.
 * @param {Array} [args.actions=[]] - Actions to perform on the folders.
 * @returns {Promise<Object>} - The result of the list mountable folders request.
 */
const executeFunction = async ({ limit = 100, actions = [] }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_mountable_folders';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    actions
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
    console.error('Error listing mountable folders:', error);
    return { error: 'An error occurred while listing mountable folders.' };
  }
};

/**
 * Tool configuration for listing mountable folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_mountable_folders',
      description: 'List all shared folders the current user can mount or unmount.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of folders to return.'
          },
          actions: {
            type: 'array',
            description: 'Actions to perform on the folders.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };