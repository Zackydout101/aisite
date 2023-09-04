const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// URL of your Azure Function (global scope)
const functionUrl = "https://testingnoww.blob.core.windows.net";

async function uploadImage(image) {
  // Path to the image file you want to upload
  const imagePath = image;

  // Create a new FormData object
  const formData = new FormData();
  formData.append('additional_data', 'value'); // Add any additional data

  // Append the image file to the FormData object
  formData.append('file', fs.createReadStream(imagePath), {
    filename: 'iphone.jpg', // Set the filename
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
    } else {
      console.log('Image upload failed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

module.exports = { uploadImage };