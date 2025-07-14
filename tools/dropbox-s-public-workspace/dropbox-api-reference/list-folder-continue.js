/**
 * Function to continue listing files in a Dropbox folder using a cursor.
 *
 * @param {Object} args - Arguments for continuing the folder listing.
 * @param {string} args.cursor - The cursor obtained from a previous `list_folder` call.
 * @returns {Promise<Object>} - The result of the folder listing continuation.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/files/list_folder/continue';
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
    console.error('Error continuing folder listing:', error);
    return { error: 'An error occurred while continuing the folder listing.' };
  }
};

/**
 * Tool configuration for continuing folder listing in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folder_continue',
      description: 'Continue listing files in a Dropbox folder using a cursor.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from a previous `list_folder` call.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };