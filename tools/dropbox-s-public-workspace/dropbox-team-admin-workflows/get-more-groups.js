/**
 * Function to get more groups from Dropbox using a cursor.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor for pagination to retrieve more groups.
 * @returns {Promise<Object>} - The response from the Dropbox API containing group information.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/list/continue';
  const accessToken = ''; // will be provided by the user

  try {
    // Set up the request body
    const body = JSON.stringify({ cursor });

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
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
      throw new Error(errorData.error_summary);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting more groups:', error);
    return { error: 'An error occurred while getting more groups.' };
  }
};

/**
 * Tool configuration for getting more groups from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_more_groups',
      description: 'Get more groups from Dropbox using a cursor.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor for pagination to retrieve more groups.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };