/**
 * Function to check the status of a job for moving former member files in Dropbox.
 *
 * @param {Object} args - Arguments for the job status check.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check.
 * @returns {Promise<Object>} - The result of the job status check.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/move_former_member_files/job_status/check';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Prepare the request body
    const body = JSON.stringify({ async_job_id });

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
    console.error('Error checking job status:', error);
    return { error: 'An error occurred while checking the job status.' };
  }
};

/**
 * Tool configuration for checking the status of a job in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_job_status',
      description: 'Check the status of a job for moving former member files in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          async_job_id: {
            type: 'string',
            description: 'The ID of the asynchronous job to check.'
          }
        },
        required: ['async_job_id']
      }
    }
  }
};

export { apiTool };