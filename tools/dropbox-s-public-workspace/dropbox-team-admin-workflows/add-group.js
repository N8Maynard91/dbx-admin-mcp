/**
 * Function to add a group in Dropbox.
 *
 * @param {Object} args - Arguments for adding a group.
 * @param {string} args.group_name - The name of the group to be created.
 * @param {string} args.group_external_id - The external ID for the group.
 * @returns {Promise<Object>} - The result of the group creation.
 */
const executeFunction = async ({ group_name, group_external_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/create';
  const accessToken = ''; // will be provided by the user

  const body = {
    group_name,
    group_external_id
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    return data;
  } catch (error) {
    console.error('Error adding group:', error);
    return { error: 'An error occurred while adding the group.', details: error.message };
  }
};

/**
 * Tool configuration for adding a group in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_group',
      description: 'Add a group in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          group_name: {
            type: 'string',
            description: 'The name of the group to be created.'
          },
          group_external_id: {
            type: 'string',
            description: 'The external ID for the group.'
          }
        },
        required: ['group_name', 'group_external_id']
      }
    }
  }
};

export { apiTool };