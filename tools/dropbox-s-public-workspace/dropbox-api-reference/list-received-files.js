/**
 * Function to list files received by the current user on Dropbox.
 *
 * @param {Object} args - Arguments for the request.
 * @param {number} [args.limit=100] - The maximum number of files to return.
 * @param {Array} [args.actions=[]] - Actions to perform on the files.
 * @returns {Promise<Object>} - The response containing the list of received files.
 */
import { apiTool as getCurrentAccountTool } from './get-current-account.js';
const getCurrentAccount = getCurrentAccountTool.function;

const executeFunction = async (args) => {
  let { limit = 100, actions = [], team_member_id } = args;

  // If team_member_id is not provided, try to fetch it from get_current_account
  if (!team_member_id) {
    const current = await getCurrentAccount();
    if (current && current.team_member_id) {
      team_member_id = current.team_member_id;
    } else {
      return { error: 'team_member_id is required for this operation and could not be determined from the token.' };
    }
  }

  const url = 'https://api.dropboxapi.com/2/sharing/list_received_files';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    actions
  });

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Select-User': team_member_id
    };

    // Perform the fetch request
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

    // Check if the response was successful
    if (!response.ok) {
      let errorObj = { status: response.status, raw: text };
      if (typeof data === 'object' && data !== null) {
        if (data.error_summary) errorObj.error_summary = data.error_summary;
        if (data.error && data.error['.tag']) errorObj.error_tag = data.error['.tag'];
        errorObj.details = data;
      }
      return { error: 'Dropbox API error', ...errorObj };
    }

    // Parse and return the response data
    return data;
  } catch (error) {
    console.error('Error listing received files:', error);
    return { error: 'An error occurred while listing received files.', details: error.message };
  }
};

/**
 * Tool configuration for listing received files on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_received_files',
      description: 'List files received by the current user on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of files to return.'
          },
          actions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Actions to perform on the files.'
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