/**
 * Function to get a legal hold policy by ID from Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.id - The ID of the legal hold policy to retrieve.
 * @returns {Promise<Object>} - The response from the Dropbox API containing the legal hold policy.
 */
const executeFunction = async ({ id }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/get_policy';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ id });

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
    console.error('Error retrieving legal hold policy:', error);
    return { error: 'An error occurred while retrieving the legal hold policy.' };
  }
};

/**
 * Tool configuration for getting a legal hold policy from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_legal_hold_policy',
      description: 'Retrieve a legal hold policy by ID from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the legal hold policy to retrieve.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };