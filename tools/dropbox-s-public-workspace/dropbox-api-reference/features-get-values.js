/**
 * Function to get feature values for the current Dropbox account.
 *
 * @param {Object} args - Arguments for the feature values request.
 * @param {Array<Object>} args.features - An array of feature objects to request values for.
 * @returns {Promise<Object>} - The response containing feature values.
 */
const executeFunction = async ({ features }) => {
  const url = 'https://api.dropboxapi.com/2/users/features/get_values';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const requestBody = {
    features: features || [
      { ".tag": "paper_as_files" },
      { ".tag": "file_locking" }
    ]
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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
    console.error('Error getting feature values:', error);
    return { error: 'An error occurred while getting feature values.' };
  }
};

/**
 * Tool configuration for getting feature values from Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_feature_values',
      description: 'Get feature values for the current Dropbox account.',
      parameters: {
        type: 'object',
        properties: {
          features: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                ".tag": {
                  type: 'string',
                  description: 'The feature tag to request.'
                }
              },
              required: ['.tag']
            },
            description: 'An array of feature objects to request values for.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };