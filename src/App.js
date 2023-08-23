import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [blobName, setBlobName] = useState('default_blob_name'); // Set a default value

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleBlobNameChange = (e) => {
    setBlobName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    const functionUrl = 'https://tico101.azurewebsites.net/api/backend';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('blob_name', blobName); // Include the custom blob_name
      formData.append('additional_data', 'value');
      const response = await axios.post(functionUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Image uploaded successfully.');
      } else {
        alert('Image upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed.');
    }
  };

  return (
    <div>
      <input type="file" accept="image/jpeg" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter custom blob name"
        value={blobName}
        onChange={handleBlobNameChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;
