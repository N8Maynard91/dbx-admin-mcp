/**
 * Function to search for files and folders in Dropbox.
 *
 * @param {Object} args - Arguments for the search.
 * @param {string} args.query - The search query for files and folders.
 * @param {boolean} [args.include_highlights=false] - Whether to include highlights in the search results.
 * @returns {Promise<Object>} - The result of the file and folder search.
 */
const executeFunction = async ({ query, include_highlights = false }) => {
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
    console.error('Error searching for files and folders:', error);
    return { error: 'An error occurred while searching for files and folders.' };
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
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };