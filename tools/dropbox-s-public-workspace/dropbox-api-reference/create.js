/**
 * Function to create a file request in Dropbox.
 *
 * @param {Object} args - Arguments for creating a file request.
 * @param {string} args.title - The title of the file request.
 * @param {string} args.destination - The destination folder for the file request.
 * @param {string} args.deadline - The deadline for the file request.
 * @param {boolean} args.open - Whether the file request is open for submissions.
 * @returns {Promise<Object>} - The response from the Dropbox API after creating the file request.
 */
const executeFunction = async ({ title, destination, deadline, open }) => {
  const url = 'https://api.dropboxapi.com/2/file_requests/create';
  const token = process.env.DROPBOX_S_PUBLIC_WORKSPACE_API_KEY;

  const body = JSON.stringify({
    title,
    destination,
    deadline,
    open
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating file request:', error);
    return { error: 'An error occurred while creating the file request.' };
  }
};

/**
 * Tool configuration for creating a file request in Dropbox.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_file_request',
      description: 'Create a file request in Dropbox.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the file request.'
          },
          destination: {
            type: 'string',
            description: 'The destination folder for the file request.'
          },
          deadline: {
            type: 'object',
            properties: {
              deadline: {
                type: 'string',
                description: 'The deadline for the file request in ISO 8601 format.'
              },
              allow_late_uploads: {
                type: 'string',
                description: 'Policy for late uploads.'
              }
            },
            required: ['deadline', 'allow_late_uploads']
          },
          open: {
            type: 'boolean',
            description: 'Whether the file request is open for submissions.'
          }
        },
        required: ['title', 'destination', 'deadline', 'open']
      }
    }
  }
};

export { apiTool };