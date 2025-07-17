/**
 * Function to check the status of an asynchronous job on Dropbox.
 *
 * @param {Object} args - Arguments for checking job status.
 * @param {string} args.async_job_id - The ID of the asynchronous job to check.
 * @returns {Promise<Object>} - The result of the job status check.
 */
const executeFunction = async ({ async_job_id, admin_team_member_id }) => {
  if (!async_job_id) {
    return { error: 'async_job_id is required.' };
  }
  const url = 'https://api.dropboxapi.com/2/team/job_status/get';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  if (admin_team_member_id) {
    headers['Dropbox-API-Select-Admin'] = admin_team_member_id;
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ async_job_id })
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    if (!response.ok) {
      if (typeof data === 'object' && data !== null && data.error_summary && data.error_summary.includes('team')) {
        return { error: 'Authentication error: This endpoint requires a team-level token and may require Dropbox-API-Select-Admin.' };
      }
      return { error: 'Dropbox API error', status: response.status, raw: text };
    }
    return data;
  } catch (err) {
    return { error: 'An error occurred while checking job status.', details: err.message };
  }
};

/**
 * Tool configuration for checking job status on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_job_status',
      description: 'Check the status of an asynchronous job on Dropbox.',
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