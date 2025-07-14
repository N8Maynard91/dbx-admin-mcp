/**
 * Function to list shared folders in Dropbox.
 *
 * @param {Object} args - Arguments for the list folders request.
 * @param {number} [args.limit=100] - The maximum number of shared folders to return.
 * @param {Array} [args.actions=[]] - Actions to perform on the shared folders.
 * @returns {Promise<Object>} - The result of the list folders request.
 */
const executeFunction = async ({ limit = 100, actions = [], team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/sharing/list_folders';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    actions
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Dropbox-API-Path-Root': JSON.stringify({ ".tag": "namespace_id", "namespace_id": "2" })
  };
  if (team_member_id) {
    headers['Dropbox-API-Select-User'] = team_member_id;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Error listing shared folders:', error);
    return { error: 'An error occurred while listing shared folders.', details: error.message };
  }
};

/**
 * Tool configuration for listing shared folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folders',
      description: 'List all shared folders the current user has access to.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of shared folders to return.'
          },
          actions: {
            type: 'array',
            description: 'Actions to perform on the shared folders.'
          },
          team_member_id: {
            type: 'string',
            description: 'The Dropbox team_member_id to act as (for Business tokens).'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };