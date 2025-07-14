/**
 * Function to list all applications linked to the team members' accounts in Dropbox.
 *
 * @returns {Promise<Object>} - The result of the linked applications request.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/team/linked_apps/list_members_linked_apps';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
 * Tool configuration for listing linked applications in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_linked_apps',
      description: 'List all applications linked to the team members\' accounts in Dropbox.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };