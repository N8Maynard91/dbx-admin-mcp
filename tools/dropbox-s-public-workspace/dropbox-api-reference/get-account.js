/**
 * Function to get information about a user's Dropbox account.
 *
 * @param {Object} args - Arguments for the account retrieval.
 * @param {string} args.account_id - The account ID of the user whose information is to be retrieved.
 * @returns {Promise<Object>} - The result of the account information retrieval.
 */
const executeFunction = async ({ account_id }) => {
  const url = 'https://api.dropboxapi.com/2/users/get_account';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ account_id });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error retrieving account information:', error);
    return { error: 'An error occurred while retrieving account information.', details: error.message };
  }
};

/**
 * Tool configuration for getting account information on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_account',
      description: 'Get information about a user\'s Dropbox account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID of the user whose information is to be retrieved.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };