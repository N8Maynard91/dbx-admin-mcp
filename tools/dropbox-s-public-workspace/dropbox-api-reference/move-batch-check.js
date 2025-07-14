/**
 * Function to check the status of a batch move operation in Dropbox.
 *
 * @param {Object} args - Arguments for the batch move check.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check.
 * @returns {Promise<Object>} - The result of the batch move check.
 */
const executeFunction = async ({ async_job_id }) => {
  const url = 'https://api.dropboxapi.com/2/files/move_batch/check_v2';
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
    console.error('Error checking batch move status:', error);
    return { error: 'An error occurred while checking the batch move status.' };
  }
};

/**
 * Tool configuration for checking the status of a batch move operation in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'move_batch_check',
      description: 'Check the status of a batch move operation in Dropbox.',
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