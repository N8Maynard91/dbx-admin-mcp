/**
 * Function to set a user's profile photo on Dropbox.
 *
 * @param {Object} args - Arguments for setting the profile photo.
 * @param {string} args.base64_data - The base64 encoded data of the profile photo.
 * @returns {Promise<Object>} - The result of the profile photo update.
 */
const executeFunction = async ({ base64_data }) => {
  const url = 'https://api.dropboxapi.com/2/account/set_profile_photo';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    photo: {
      '.tag': 'base64_data',
      base64_data: base64_data
    }
  });

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
    console.error('Error setting profile photo:', error);
    return { error: 'An error occurred while setting the profile photo.' };
  }
};

/**
 * Tool configuration for setting a user's profile photo on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_profile_photo',
      description: 'Set a user\'s profile photo on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          base64_data: {
            type: 'string',
            description: 'The base64 encoded data of the profile photo.'
          }
        },
        required: ['base64_data']
      }
    }
  }
};

export { apiTool };