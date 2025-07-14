/**
 * Function to retrieve information about a team from Dropbox.
 *
 * @returns {Promise<Object>} - The result of the team information retrieval.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/team/get_info';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers
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
    console.error('Error retrieving team information:', error);
    return { error: 'An error occurred while retrieving team information.', details: error.message };
  }
};

/**
 * Tool configuration for retrieving team information from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_info',
      description: 'Retrieve information about a team from Dropbox.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };