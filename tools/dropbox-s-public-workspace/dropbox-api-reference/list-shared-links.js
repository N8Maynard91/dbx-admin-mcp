/**
 * Function to list shared links for the current user on Dropbox.
 *
 * @param {Object} args - Arguments for the shared links request.
 * @param {string} [args.cursor] - A cursor for pagination to retrieve more results.
 * @param {string} [team_member_id] - Optional team member ID to act as.
 * @returns {Promise<Object>} - The result of the shared links listing.
 */
const executeFunction = async ({ cursor, team_member_id }) => {
  if (!team_member_id) {
    return { error: 'team_member_id is required for this operation. Please provide the team_member_id to act as.' };
  }
  const url = 'https://api.dropboxapi.com/2/sharing/list_shared_links';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  try {
    // Prepare the request body
    const body = JSON.stringify({
      cursor: cursor || undefined
    });

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Dropbox-API-Select-User': team_member_id
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing shared links:', error);
    return { error: 'An error occurred while listing shared links.' };
  }
};

/**
 * Tool configuration for listing shared links on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_shared_links',
      description: 'List shared links for the current user on Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'A cursor for pagination to retrieve more results.'
          },
          team_member_id: {
            type: 'string',
            description: 'Optional team member ID to act as.'
          }
        }
      }
    }
  }
};

export { apiTool };