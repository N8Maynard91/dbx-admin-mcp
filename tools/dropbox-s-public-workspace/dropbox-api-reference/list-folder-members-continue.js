/**
 * Function to continue listing folder members in Dropbox.
 *
 * @param {Object} args - Arguments for continuing to list folder members.
 * @param {string} args.cursor - The cursor obtained from the previous `list_folder_members` call.
 * @returns {Promise<Object>} - The result of the folder members listing.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_folder_members/continue';
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
    console.error('Error continuing to list folder members:', error);
    return { error: 'An error occurred while continuing to list folder members.' };
  }
};

/**
 * Tool configuration for continuing to list folder members in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folder_members_continue',
      description: 'Continue listing folder members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from the previous `list_folder_members` call.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };