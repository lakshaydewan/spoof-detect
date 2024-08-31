// src/components/LivenessCheck.jsx

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

const LivenessCheck = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [result, setResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // State to store the captured image

  useEffect(() => {
    // Load TensorFlow.js model
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model(2).json'); // Adjust the path if necessary
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
      }
      console.log(model);
    };
    loadModel();
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Store the captured image in state

    if (model && imageSrc) {
      // Preprocess the image and run inference
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = 'anonymous'; // To avoid CORS issues
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeBilinear([224, 224]) // Adjust to your model's input size
          .expandDims(0)
          .toFloat()
          .div(tf.scalar(255));
        const prediction = model.predict(tensor);
        const predictionData = await prediction.data();

        // Assuming binary classification (live/not live)
        setResult(predictionData[0] > 0.5 ? 'Live' : 'Not Live');
      };
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Liveness Check</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        height={500}
        width={500}
        videoConstraints={{ facingMode: 'user' }}
      />
      <br />
      <button onClick={capture} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Check Liveness
      </button>

      {capturedImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" style={{ width: '500px', height: '500px', objectFit: 'cover' }} />
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result: {result}</h3>
        </div>
      )}
    </div>
  );
};

export default LivenessCheck;