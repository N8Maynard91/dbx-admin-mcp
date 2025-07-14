/**
 * Function to modify the settings of a shared link on Dropbox.
 *
 * @param {Object} args - Arguments for modifying shared link settings.
 * @param {string} args.url - The URL of the shared link to modify.
 * @param {Object} args.settings - The settings to apply to the shared link.
 * @param {string} args.settings.requested_visibility - The requested visibility of the shared link.
 * @param {string} args.settings.audience - The audience for the shared link.
 * @param {string} args.settings.access - The access level for the shared link.
 * @param {boolean} args.remove_expiration - Whether to remove expiration from the shared link.
 * @returns {Promise<Object>} - The result of the shared link modification.
 */
const executeFunction = async ({ url, settings, remove_expiration }) => {
  const accessToken = ''; // will be provided by the user
  const apiUrl = 'https://api.dropboxapi.com/2/sharing/modify_shared_link_settings';

  const requestBody = {
    url,
    settings,
    remove_expiration
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Perform the fetch request
    const response = await fetch(apiUrl, {
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
    console.error('Error modifying shared link settings:', error);
    return { error: 'An error occurred while modifying shared link settings.' };
  }
};

/**
 * Tool configuration for modifying shared link settings on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'modify_shared_link_settings',
      description: 'Modify the settings of a shared link on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the shared link to modify.'
          },
          settings: {
            type: 'object',
            properties: {
              requested_visibility: {
                type: 'string',
                description: 'The requested visibility of the shared link.'
              },
              audience: {
                type: 'string',
                description: 'The audience for the shared link.'
              },
              access: {
                type: 'string',
                description: 'The access level for the shared link.'
              }
            },
            required: ['requested_visibility', 'audience', 'access']
          },
          remove_expiration: {
            type: 'boolean',
            description: 'Whether to remove expiration from the shared link.'
          }
        },
        required: ['url', 'settings']
      }
    }
  }
};

export { apiTool };