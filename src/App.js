import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const fileInputRef = React.createRef(); // Create a reference for the file input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResult(res.data);
    } catch (err) {
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
  };

  const handleClick = () => {
    // Trigger the file input dialog when the drop area is clicked
    fileInputRef.current.click();
  };

  return (
    <div className="app dark-theme">
      <header className="header">
        <h1>🕵️‍♂️ Deepfake Detector</h1>
      </header>
      <div className="card">
        <div
          className="drop-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick} // Trigger file input on click
        >
          <p>Drag and drop an image here, or click to upload.</p>
          <input
            ref={fileInputRef} // Reference the input element
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`upload-button ${loading || !file ? "disabled" : ""}`}
        >
          {loading ? "Checking..." : "Check Image"}
        </button>

        {result && (
          <div className="result">
            <h2 className="result-text">
              Prediction:{" "}
              <span
                className={`result-label ${
                  result.label === "REAL" ? "real" : "fake"
                }`}
              >
                {result.label}
              </span>
            </h2>
            <div className="confidence-bar">
              <div
                className={`confidence-fill ${
                  result.label === "REAL" ? "real" : "fake"
                }`}
                style={{
                  width: `${result.confidence * 100}%`,
                  transition: "width 1s ease",
                }}
              ></div>
            </div>
            <p className="confidence-text">
              Confidence: {Math.round(result.confidence * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
