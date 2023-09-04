import styles from "./App.module.css";
import React, { useState, useEffect } from 'react';
function App() {
  const [responseText1, setResponseText1] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [containerName, setContainerName] = useState('');
  const [randomWord, setRandomWord] = useState(''); // Use useState to store randomWord
  const [triggerEffect, setTriggerEffect] = useState(false); 
    const [backgroundImageURL, setBackgroundImageURL] = useState(null); // Updated state variable

  const handleContainerNameChange = (event) => {
    setContainerName(event.target.value);
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      setIsLoading(true);

      if (!file) {
        console.error('No file selected');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImageURL(imageUrl);

      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      function generateRandomWord(length) {
        let randomWord = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomWord += characters.charAt(randomIndex);
        }
        return randomWord;
      }

      const newRandomWord = generateRandomWord(10);
      setRandomWord(newRandomWord); // Update the randomWord state

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', newRandomWord);

      const uploadUrl = 'https://tico101.azurewebsites.net/api/backend';

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const aiUploadUrl = 'https://859v82leol.execute-api.us-east-2.amazonaws.com/default/AIimage';

      const aiFormData = new FormData();
      aiFormData.append('name', newRandomWord);

      const aiResponse = await fetch(aiUploadUrl, {
        method: 'POST',
        body: aiFormData,
      });

      if (!aiResponse.ok) {
        setTriggerEffect(true);
      }
      setTriggerEffect(true);

      const aiData = await aiResponse.json();
      console.log('AI image processing successful:', aiData);
    } catch (error) {
      console.error('Error handling image upload and processing:', error);
    }
  };

  const handleSubmit = async (event) => {
    try {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const file = event.target.files[0];

      function generateRandomWord(length) {
        let randomWord = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomWord += characters.charAt(randomIndex);
        }
        return randomWord;
      }

      const newRandomWord = generateRandomWord(10);
      setRandomWord(newRandomWord); // Update the randomWord state

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', newRandomWord);
      formData.append('container_name', containerName);

      const uploadUrl = 'https://tico101.azurewebsites.net/api/httptrigger1';

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const text = await response.text();
      setResponseText1(text);
      
    } catch (error) {
      console.error('Error handling submit:', error);
      setIsLoading(false);
    }
  };

   useEffect(() => {
  if (triggerEffect) {
    let intervalId;

    const fetchData = () => {
      fetch("https://testingnoww.blob.core.windows.net/key/" + randomWord + ".txt")
        .then((response) => {
          if (response.ok) {
            setIsLoading(false);
            return response.text();
          } else {
            throw new Error("URL is not downloadable");
          }
        })
        .then((data) => {
          setResponseText1(data);
          setIsLoading(false);
          clearInterval(intervalId);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Set responseText1 to indicate that the URL is not downloadable
          setResponseText1("URL is not downloadable");
          setIsLoading(false);
          clearInterval(intervalId);
        });
    };

    intervalId = setInterval(fetchData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }
}, [triggerEffect, randomWord]); // Add randomWord as a dependency to useEffect

   return (
  <div>
    {/* Image Upload */}
    <div className={styles["centered-content"]}>
      <div className={styles["image-upload-container"]}>
        <label htmlFor="image-file" className={styles["upload-button"]}>
          <span className={styles["upload-label"]}><p>Upload Image:</p></span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="image-file"
            className={styles["upload-input"]}
          />
        </label>
        <div className={styles["center-container"]}>
          <img
            src={backgroundImageURL}
            alt=""
            className={styles["uploaded-image"]}
          />
        </div>
      </div>

      {/* Prediction */}
      <div className={styles["prediction-container"]}>
        <h1>{isLoading ? "Predicted" : "Waiting for Image..."}</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <pre>{responseText1}</pre>
          </>
        )}
      </div>
    </div>

    {/* Text File Upload and Input Fields */}
    <p>Required before uploading:</p>
    <div className={styles["center-container"]}>
      <input
        type="text"
        id="container-name"
        placeholder="Enter what you uploaded"
        value={containerName}
        onChange={handleContainerNameChange}
        className={styles["center-button"]}
      />
    </div>

    <div className={styles["center-container"]}>
      <button className={styles["center-button"]} onClick={handleSubmit}>
        <label htmlFor="text-file" className={styles["center-button"]}>
          Upload Dev
        </label>
      </button>

      <input
        type="file"
        id="text-file"
        style={{ display: 'none' }}
        onChange={handleSubmit}
      />
    </div>

    <p>
      *To obtain accurate predictions from an AI model, it is advisable to have at least 20 images for each category (ex: apple)
      <br></br>
      *The AI model undergoes retraining on an hourly basis.<br></br>
         *Have any questions? Email: zleve009@uottawa.ca
         <br></br>
         *The AI model is 95% accurately**(depends on some factors)
    </p>
  </div>
);
}

export default App;