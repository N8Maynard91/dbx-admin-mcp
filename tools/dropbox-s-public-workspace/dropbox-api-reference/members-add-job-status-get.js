/**
 * Function to get the job status of adding members in Dropbox.
 *
 * @param {Object} args - Arguments for the job status request.
 * @param {string} args.async_job_id - The async job ID returned from the members/add request.
 * @returns {Promise<Object>} - The result of the job status request.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/add/job_status/get';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const requestBody = JSON.stringify({ async_job_id });

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
      body: requestBody
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
    return { error: 'An error occurred while getting the job status.' };
  }
};

/**
 * Tool configuration for getting the job status of adding members in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_members_add_job_status',
      description: 'Get the job status of adding members in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          async_job_id: {
            type: 'string',
            description: 'The async job ID returned from the members/add request.'
          }
        },
        required: ['async_job_id']
      }
    }
  }
};

export { apiTool };