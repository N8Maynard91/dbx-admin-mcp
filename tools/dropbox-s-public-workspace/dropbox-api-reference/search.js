/**
 * Function to search for files and folders in Dropbox.
 *
 * @param {Object} args - Arguments for the search.
 * @param {string} args.query - The search query for files and folders.
 * @param {boolean} [args.include_highlights=false] - Whether to include highlights in the search results.
 * @returns {Promise<Object>} - The result of the file and folder search.
 */
import { executeFunction as getCurrentAccount } from './get-current-account.js';

const executeFunction = async (args) => {
  let { query, include_highlights = false, team_member_id } = args;

  // If team_member_id is not provided, try to fetch it from get_current_account
  if (!team_member_id) {
    const current = await getCurrentAccount();
    if (current && current.team_member_id) {
      team_member_id = current.team_member_id;
    } else {
      return { error: 'team_member_id is required for this operation and could not be determined from the token.' };
    }
  }

  const url = 'https://api.dropboxapi.com/2/files/search_v2';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    query,
    include_highlights
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
    console.error('Error searching for files and folders:', error);
    return { error: 'An error occurred while searching for files and folders.', details: error.message };
  }
};

/**
 * Tool configuration for searching files and folders in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search for files and folders in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query for files and folders.'
          },
          include_highlights: {
            type: 'boolean',
            description: 'Whether to include highlights in the search results.'
          },
          team_member_id: {
            type: 'string',
            description: 'The Dropbox team_member_id to act as (for Business tokens).'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };