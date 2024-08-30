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
    // const loadModel = async () => {
    //   const loadedModel = await tf.loadLayersModel('path-to-your-model/model.json');
    //   setModel(loadedModel);
    // };
    // loadModel();
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Store the captured image in state

    console.log(imageSrc);

    // if (imageSrc) {
    //   // Preprocess the image and run inference
    //   const img = new Image();
    //   img.src = imageSrc;
    //   img.onload = async () => {
    //     const tensor = tf.browser.fromPixels(img).resizeBilinear([224, 224]).expandDims(0).toFloat().div(tf.scalar(255));
    //     const prediction = model.predict(tensor);
    //     const predictionData = await prediction.data();

    //     // Assuming binary classification (live/not live)
    //     setResult(predictionData[0] > 0.5 ? 'Live' : 'Not Live');
    //   };
    // }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" height={500} width={500} />
      <button onClick={capture}>Check Liveness</button>
      
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" style={{ width: '500px', height: '500px', objectFit: "cover" }} />
        </div>
      )}

      {result && <p>{result}</p>}
    </div>
  );
};

export default LivenessCheck;

