const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream'); // Import Readable from the 'stream' module

// URL of your Azure Function (global scope)
const functionUrl = 'https://tico101.azurewebsites.net/api/backend';

async function uploadImage(imageBuffer, blobname) {
  // Create a new FormData object
  const formData = new FormData();
  formData.append('additional_data', 'value'); // Add any additional data

  // Create a Readable stream from the image buffer
  const imageStream = Readable.from(imageBuffer);

  // Append the image file to the FormData object
  formData.append('file', imageStream, {
    filename: blobname, // Set the filename
    contentType: 'image/jpeg', // Set the content type
  });

  // Define the headers for the request
  const headers = {
    ...formData.getHeaders(), // Include the FormData headers
  };

  try {
    // Send the POST request with the FormData
    const response = await axios.post(functionUrl, formData, { headers });

    if (response.status === 200) {
      console.log('Image uploaded successfully.');
      return response.headers.etag; // Return the ETag from the response if needed
    } else {
      console.log('Image upload failed.');
      return null; // Return null or handle the error as needed
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = { uploadImage };