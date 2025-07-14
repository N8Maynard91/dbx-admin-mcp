/**
 * Function to check the status of a share job in Dropbox.
 *
 * @param {Object} args - Arguments for the share job status check.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check.
 * @returns {Promise<Object>} - The result of the share job status check.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/check_share_job_status';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ async_job_id });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking share job status:', error);
    return { error: 'An error occurred while checking the share job status.' };
  }
};

/**
 * Tool configuration for checking share job status in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_share_job_status',
      description: 'Check the status of a share job in Dropbox.',
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