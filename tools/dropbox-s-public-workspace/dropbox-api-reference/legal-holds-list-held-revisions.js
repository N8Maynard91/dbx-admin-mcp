/**
 * Function to list held revisions for a legal hold in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.id - The ID of the legal hold.
 * @returns {Promise<Object>} - The response from the Dropbox API containing held revisions.
 */
const executeFunction = async ({ id }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/list_held_revisions';
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
    console.error('Error listing held revisions:', error);
    return { error: 'An error occurred while listing held revisions.' };
  }
};

/**
 * Tool configuration for listing held revisions for a legal hold in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_held_revisions',
      description: 'List held revisions for a legal hold in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the legal hold.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };