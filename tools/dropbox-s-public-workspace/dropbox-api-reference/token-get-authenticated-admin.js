/**
 * Function to get the authenticated admin profile from Dropbox.
 *
 * @returns {Promise<Object>} - The profile of the admin who generated the team access token.
 */
const executeFunction = async () => {
  const url = 'https://api.dropboxapi.com/2/team/token/get_authenticated_admin';
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
    console.error('Error getting authenticated admin profile:', error);
    return { error: 'An error occurred while getting the authenticated admin profile.', details: error.message };
  }
};

/**
 * Tool configuration for getting the authenticated admin profile from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_authenticated_admin',
      description: 'Get the profile of the admin who generated the team access token.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };