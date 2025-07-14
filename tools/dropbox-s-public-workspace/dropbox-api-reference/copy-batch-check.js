/**
 * Function to check the status of an asynchronous job for Dropbox's copy_batch.
 *
 * @param {Object} args - Arguments for the check.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check.
 * @returns {Promise<Object>} - The result of the job status check.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/files/copy_batch/check_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({
    async_job_id
  });

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
    console.error('Error checking job status:', error);
    return { error: 'An error occurred while checking the job status.' };
  }
};

/**
 * Tool configuration for checking the status of a copy_batch job on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'copy_batch_check',
      description: 'Check the status of an asynchronous copy_batch job on Dropbox.',
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