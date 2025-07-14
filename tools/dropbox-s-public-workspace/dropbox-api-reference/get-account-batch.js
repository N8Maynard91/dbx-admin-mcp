/**
 * Function to get account information for multiple users from Dropbox.
 *
 * @param {Object} args - Arguments for the account batch request.
 * @param {Array<string>} args.account_ids - An array of account IDs to retrieve information for.
 * @returns {Promise<Object>} - The result of the account batch request.
 */
const executeFunction = async ({ account_ids }) => {
  const url = 'https://api.dropboxapi.com/2/users/get_account_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const requestBody = {
    account_ids
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
    console.error('Error retrieving account batch information:', error);
    return { error: 'An error occurred while retrieving account batch information.', details: error.message };
  }
};

/**
 * Tool configuration for getting account information from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_account_batch',
      description: 'Get information about multiple user accounts from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          account_ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of account IDs to retrieve information for.'
          }
        },
        required: ['account_ids']
      }
    }
  }
};

export { apiTool };