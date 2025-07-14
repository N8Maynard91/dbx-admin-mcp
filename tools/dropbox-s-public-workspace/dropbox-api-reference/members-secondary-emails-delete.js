/**
 * Function to delete secondary emails from Dropbox team members.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {Array<Object>} args.emails_to_delete - An array of objects containing user IDs and secondary emails to delete.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ emails_to_delete }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/secondary_emails/delete';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    emails_to_delete
  };

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
    console.error('Error deleting secondary emails:', error);
    return { error: 'An error occurred while deleting secondary emails.' };
  }
};

/**
 * Tool configuration for deleting secondary emails from Dropbox team members.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_secondary_emails',
      description: 'Delete secondary emails from Dropbox team members.',
      parameters: {
        type: 'object',
        properties: {
          emails_to_delete: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    '.tag': {
                      type: 'string',
                      description: 'The tag indicating the type of user.'
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
                    description: 'The secondary email addresses to delete.'
                  },
                  description: 'List of secondary emails to delete for the user.'
                }
              },
              required: ['user', 'secondary_emails']
            },
            description: 'An array of objects containing user IDs and secondary emails to delete.'
          }
        },
        required: ['emails_to_delete']
      }
    }
  }
};

export { apiTool };