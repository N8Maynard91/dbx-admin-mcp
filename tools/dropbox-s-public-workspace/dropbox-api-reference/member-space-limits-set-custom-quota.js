/**
 * Function to set a custom quota for Dropbox team members.
 *
 * @param {Object} args - Arguments for setting the custom quota.
 * @param {Array} args.users_and_quotas - An array of user quota objects.
 * @returns {Promise<Object>} - The result of the quota setting operation.
 */
const executeFunction = async ({ users_and_quotas }) => {
  const url = 'https://api.dropboxapi.com/2/team/member_space_limits/set_custom_quota';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the body of the request
    const body = JSON.stringify({ users_and_quotas });

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
    console.error('Error setting custom quota:', error);
    return { error: 'An error occurred while setting the custom quota.' };
  }
};

/**
 * Tool configuration for setting custom quota for Dropbox team members.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'set_custom_quota',
      description: 'Set a custom quota for Dropbox team members.',
      parameters: {
        type: 'object',
        properties: {
          users_and_quotas: {
            type: 'array',
            description: 'An array of user quota objects, each containing user ID and quota in GB.'
          }
        },
        required: ['users_and_quotas']
      }
    }
  }
};

export { apiTool };