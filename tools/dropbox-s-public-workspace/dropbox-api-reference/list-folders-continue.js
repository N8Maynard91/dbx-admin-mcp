/**
 * Function to continue listing shared folders in Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.cursor - The cursor from a previous call to `list_folders` or `list_folders/continue`.
 * @returns {Promise<Object>} - The result of the list folders continue request.
 */
const executeFunction = async ({ cursor }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_folders/continue';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" }),
      'Dropbox-API-Select-User': 'dbmid:FDFSVF-DFSDF'
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
    console.error('Error continuing to list folders:', error);
    return { error: 'An error occurred while continuing to list folders.' };
  }
};

/**
 * Tool configuration for continuing to list shared folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folders_continue',
      description: 'Continue listing shared folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor from a previous call to `list_folders` or `list_folders/continue`.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };