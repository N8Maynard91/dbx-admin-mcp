/**
 * Function to release a legal hold by Id in Dropbox.
 *
 * @param {Object} args - Arguments for the release policy.
 * @param {string} args.id - The ID of the legal hold to be released.
 * @returns {Promise<Object>} - The result of the release policy operation.
 */
const executeFunction = async ({ id }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/release_policy';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ id });

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
    console.error('Error releasing legal hold:', error);
    return { error: 'An error occurred while releasing the legal hold.' };
  }
};

/**
 * Tool configuration for releasing a legal hold in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'release_legal_hold',
      description: 'Releases a legal hold by Id in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the legal hold to be released.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };