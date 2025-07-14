/**
 * Function to continue listing file members in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor obtained from a previous call to list_file_members or list_file_members/batch.
 * @returns {Promise<Object>} - The result of the file members listing.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_file_members/continue';
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
    console.error('Error continuing to list file members:', error);
    return { error: 'An error occurred while continuing to list file members.' };
  }
};

/**
 * Tool configuration for continuing to list file members in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_file_members_continue',
      description: 'Continue listing file members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor obtained from a previous call to list_file_members or list_file_members/batch.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };