/**
 * Function to longpoll for changes in a Dropbox folder.
 *
 * @param {Object} args - Arguments for the longpoll request.
 * @param {string} args.cursor - The cursor to continue from.
 * @param {number} [args.timeout=30] - The timeout in seconds for the longpoll.
 * @returns {Promise<Object>} - The result of the longpoll request.
 */
const executeFunction = async ({ cursor, timeout = 30 }) => {
  const url = 'https://notify.dropboxapi.com/2/files/list_folder/longpoll';
  const accessToken = ''; // will be provided by the user

  try {
    // Prepare the request body
    const body = JSON.stringify({ cursor, timeout });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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
    console.error('Error during longpoll request:', error);
    return { error: 'An error occurred while longpolling for changes.' };
  }
};

/**
 * Tool configuration for longpolling changes in a Dropbox folder.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_folder_longpoll',
      description: 'Longpoll for changes in a Dropbox folder.',
      parameters: {
        type: 'object',
        properties: {
          cursor: {
            type: 'string',
            description: 'The cursor to continue from.'
          },
          timeout: {
            type: 'integer',
            description: 'The timeout in seconds for the longpoll.'
          }
        },
        required: ['cursor']
      }
    }
  }
};

export { apiTool };