/**
 * Function to continue listing the file metadata that's under legal hold in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.id - The ID of the legal hold to continue listing revisions for.
 * @returns {Promise<Object>} - The response from the Dropbox API containing the held revisions.
 */
const executeFunction = async ({ id }) => {
  const url = 'https://api.dropboxapi.com/2/team/legal_holds/list_held_revisions_continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ id });

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
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
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error continuing to list held revisions:', error);
    return { error: 'An error occurred while continuing to list held revisions.' };
  }
};

/**
 * Tool configuration for continuing to list held revisions in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'legal_holds_list_held_revisions_continue',
      description: 'Continue listing the file metadata that\'s under legal hold in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the legal hold to continue listing revisions for.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };