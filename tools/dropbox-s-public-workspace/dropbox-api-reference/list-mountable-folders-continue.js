/**
 * Function to continue listing mountable folders in Dropbox.
 *
 * @param {Object} args - Arguments for the continuation request.
 * @param {string} args.cursor - The cursor obtained from a previous call to `list_mountable_folders` or `list_mountable_folders/continue`.
 * @returns {Promise<Object>} - The result of the continuation request for mountable folders.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_mountable_folders/continue';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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
    console.error('Error continuing to list mountable folders:', error);
    return { error: 'An error occurred while continuing to list mountable folders.' };
  }
};

/**
 * Tool configuration for continuing to list mountable folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_mountable_folders_continue',
      description: 'Continue listing mountable folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from a previous call to `list_mountable_folders` or `list_mountable_folders/continue`.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };