/**
 * Function to retrieve information about one or more groups in Dropbox.
 *
 * @param {Object} args - Arguments for the group information retrieval.
 * @param {Array<string>} args.group_ids - An array of group IDs to retrieve information for.
 * @returns {Promise<Object>} - The result of the group information retrieval.
 */
const executeFunction = async ({ group_ids }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/get_info';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const requestBody = {
    ".tag": "group_ids",
    group_ids
  };

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
      body: JSON.stringify(requestBody)
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
    console.error('Error retrieving group information:', error);
    return { error: 'An error occurred while retrieving group information.' };
  }
};

/**
 * Tool configuration for retrieving group information in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'groups_get_info',
      description: 'Retrieve information about one or more groups in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of group IDs to retrieve information for.'
          }
        },
        required: ['group_ids']
      }
    }
  }
};

export { apiTool };