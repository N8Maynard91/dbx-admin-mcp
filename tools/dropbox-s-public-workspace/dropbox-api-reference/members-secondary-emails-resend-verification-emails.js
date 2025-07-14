/**
 * Function to resend secondary email verification emails for Dropbox team members.
 *
 * @param {Object} args - Arguments for the resend verification emails request.
 * @param {Array<Object>} args.emails_to_resend - List of emails to resend verification for.
 * @param {string} args.emails_to_resend[].user.tag - The tag indicating the type of user.
 * @param {string} args.emails_to_resend[].user.team_member_id - The ID of the team member.
 * @param {Array<string>} args.emails_to_resend[].secondary_emails - List of secondary emails to resend verification for.
 * @returns {Promise<Object>} - The result of the resend verification emails request.
 */
const executeFunction = async ({ emails_to_resend }) => {
  const url = 'https://api.dropboxapi.com/2/team/members/secondary_emails/resend_verification_emails';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = {
    emails_to_resend
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
    console.error('Error resending verification emails:', error);
    return { error: 'An error occurred while resending verification emails.' };
  }
};

/**
 * Tool configuration for resending secondary email verification emails on Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'resend_verification_emails',
      description: 'Resend secondary email verification emails for Dropbox team members.',
      parameters: {
        type: 'object',
        properties: {
          emails_to_resend: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    tag: {
                      type: 'string',
                      description: 'The tag indicating the type of user.'
                    },
                    team_member_id: {
                      type: 'string',
                      description: 'The ID of the team member.'
                    }
                  },
                  required: ['tag', 'team_member_id']
                },
                secondary_emails: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'Secondary email addresses to resend verification for.'
                  }
                }
              },
              required: ['user', 'secondary_emails']
            }
          }
        },
        required: ['emails_to_resend']
      }
    }
  }
};

export { apiTool };