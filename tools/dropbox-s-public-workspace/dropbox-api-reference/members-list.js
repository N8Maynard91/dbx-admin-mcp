/**
 * Function to list members of a Dropbox team.
 *
 * @param {Object} args - Arguments for the member listing.
 * @param {number} [args.limit=100] - The maximum number of members to return.
 * @param {boolean} [args.include_removed=false] - Whether to include removed members in the response.
 * @returns {Promise<Object>} - The result of the members listing.
 */
const executeFunction = async ({ limit = 100, include_removed = false }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/list';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    limit,
    include_removed
  });

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
    console.error('Error listing team members:', error);
    return { error: 'An error occurred while listing team members.' };
  }
};

/**
 * Tool configuration for listing members of a Dropbox team.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_members',
      description: 'List members of a Dropbox team.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'The maximum number of members to return.'
          },
          include_removed: {
            type: 'boolean',
            description: 'Whether to include removed members in the response.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };