/**
 * Function to recover a deleted member in Dropbox.
 *
 * @param {Object} args - Arguments for the member recovery.
 * @param {string} args.team_member_id - The ID of the team member to recover.
 * @returns {Promise<Object>} - The result of the member recovery operation.
 */
const executeFunction = async ({ team_member_id }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/recover';
  const accessToken = ''; // will be provided by the user

  const body = {
    user: {
      ".tag": "team_member_id",
      team_member_id
    }
  };

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
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
    console.error('Error recovering member:', error);
    return { error: 'An error occurred while recovering the member.' };
  }
};

/**
 * Tool configuration for recovering a deleted member in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'recover_member',
      description: 'Recover a deleted member in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          team_member_id: {
            type: 'string',
            description: 'The ID of the team member to recover.'
          }
        },
        required: ['team_member_id']
      }
    }
  }
};

export { apiTool };