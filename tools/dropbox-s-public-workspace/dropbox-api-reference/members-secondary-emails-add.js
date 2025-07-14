/**
 * Function to add secondary emails to Dropbox team members.
 *
 * @param {Object} args - Arguments for adding secondary emails.
 * @param {Array} args.new_secondary_emails - An array of objects containing user IDs and their corresponding secondary emails.
 * @returns {Promise<Object>} - The result of the operation to add secondary emails.
 */
const executeFunction = async ({ new_secondary_emails }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/secondary_emails/add';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({ new_secondary_emails });

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
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding secondary emails:', error);
    return { error: 'An error occurred while adding secondary emails.' };
  }
};

/**
 * Tool configuration for adding secondary emails to Dropbox team members.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_secondary_emails',
      description: 'Add secondary emails to Dropbox team members.',
      parameters: {
        type: 'object',
        properties: {
          new_secondary_emails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    '.tag': {
                      type: 'string',
                      description: 'The type of user identifier.'
                    },
                    team_member_id: {
                      type: 'string',
                      description: 'The ID of the team member.'
                    }
                  },
                  required: ['.tag', 'team_member_id']
                },
                secondary_emails: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'A secondary email address to add for the user.'
                  }
                }
              },
              required: ['user', 'secondary_emails']
            }
          }
        },
        required: ['new_secondary_emails']
      }
    }
  }
};

export { apiTool };