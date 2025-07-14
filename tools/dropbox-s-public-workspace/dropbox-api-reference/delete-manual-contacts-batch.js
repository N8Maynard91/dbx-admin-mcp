/**
 * Function to delete manually added contacts in Dropbox.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {Array<string>} args.email_addresses - List of email addresses to be removed.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ email_addresses }) => {
  const url = 'https://api.dropboxapi.com/2/contacts/delete_manual_contacts_batch';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const body = JSON.stringify({ email_addresses });

  try {
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
    console.error('Error deleting contacts:', error);
    return { error: 'An error occurred while deleting contacts.' };
  }
};

/**
 * Tool configuration for deleting manually added contacts in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_manual_contacts_batch',
      description: 'Delete manually added contacts from Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          email_addresses: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'List of email addresses to be removed.'
          }
        },
        required: ['email_addresses']
      }
    }
  }
};

export { apiTool };