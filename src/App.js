import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
      setSelectedFile(null);
      setPreview(null);
    }
  };

  // Handle image upload and analysis
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make API request
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set result
      setResult({
        damage: response.data.damage,
        confidence: (response.data.confidence * 100).toFixed(2),
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to analyze image. Please try again.'
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏘️ Earthquake Damage Detection</h1>
          <p style={styles.subtitle}>
            Upload an image to analyze structural damage using AI
          </p>
        </div>

        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <label style={styles.fileLabel}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
              disabled={loading}
            />
            <span style={styles.fileLabelText}>
              📁 Click to select an image
            </span>
          </label>

          {/* Image Preview */}
          {preview && (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
              <p style={styles.previewText}>
                {selectedFile?.name || 'Image selected'}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>⚠️ {error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttonContainer}>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              style={{
                ...styles.analyzeButton,
                ...((!selectedFile || loading) && styles.analyzeButtonDisabled),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}>⏳</span> Analyzing...
                </>
              ) : (
                '🔍 Analyze Image'
              )}
            </button>

            {selectedFile && (
              <button onClick={handleReset} style={styles.resetButton}>
                🔄 Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div style={styles.resultSection}>
            <h2 style={styles.resultTitle}>Analysis Results</h2>

            {/* Damage Status */}
            <div
              style={{
                ...styles.resultBox,
                backgroundColor:
                  result.damage === 'Yes'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(34, 197, 94, 0.1)',
                borderColor:
                  result.damage === 'Yes' ? '#ef4444' : '#22c55e',
              }}
            >
              <p style={styles.resultLabel}>Damage Status:</p>
              <p
                style={{
                  ...styles.resultValue,
                  color: result.damage === 'Yes' ? '#ef4444' : '#22c55e',
                }}
              >
                {result.damage === 'Yes' ? '🔴 DAMAGE DETECTED' : '✅ NO DAMAGE'}
              </p>
            </div>

            {/* Confidence Score */}
            <div style={styles.resultBox}>
              <p style={styles.resultLabel}>Confidence Score:</p>
              <p style={styles.resultValue}>{result.confidence}%</p>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${result.confidence}%`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <button onClick={handleReset} style={styles.newAnalysisButton}>
              🔄 Analyze Another Image
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Backend API: http://127.0.0.1:8000/predict
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
  },

  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 10px 0',
  },

  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
  },

  uploadSection: {
    marginBottom: '30px',
  },

  fileLabel: {
    display: 'block',
    padding: '30px',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9fafb',
  },

  fileInput: {
    display: 'none',
  },

  fileLabelText: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500',
  },

  previewContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },

  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },

  previewText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0',
  },

  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '15px',
    marginBottom: '15px',
  },

  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    margin: '0',
  },

  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },

  analyzeButton: {
    flex: 1,
    minWidth: '150px',
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  analyzeButtonDisabled: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  resetButton: {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },

  resultSection: {
    marginTop: '40px',
    paddingTop: '40px',
    borderTop: '2px solid #e5e7eb',
  },

  resultTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },

  resultBox: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    marginBottom: '15px',
  },

  resultLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
  },

  resultValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0',
  },

  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginTop: '10px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    transition: 'width 0.3s ease',
  },

  newAnalysisButton: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },

  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
  },

  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0',
  },
};

export default App;
