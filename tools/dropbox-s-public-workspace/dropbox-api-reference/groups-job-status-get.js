/**
 * Function to get the status of a group job in Dropbox.
 *
 * @param {Object} args - Arguments for the job status request.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check the status of.
 * @returns {Promise<Object>} - The result of the job status request.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/groups/job_status/get';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up the request body
    const body = JSON.stringify({ async_job_id });

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
    console.error('Error getting job status:', error);
    return { error: 'An error occurred while getting job status.' };
  }
};

/**
 * Tool configuration for getting the status of a group job in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_group_job_status',
      description: 'Get the status of a group job in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          async_job_id: {
            type: 'string',
            description: 'The ID of the asynchronous job to check the status of.'
          }
        },
        required: ['async_job_id']
      }
    }
  }
};

export { apiTool };