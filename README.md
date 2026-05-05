# 🏘️ Earthquake Damage Detection - Frontend

A modern React-based web application for analyzing structural damage in earthquake-affected areas using AI/ML predictions from a FastAPI backend.

## Features

✅ **Image Upload & Preview** - Drag-and-drop or click to select images
✅ **Real-time Analysis** - Send images to AI model for damage detection
✅ **Visual Results** - Color-coded output (Red for damage, Green for safe)
✅ **Confidence Score** - Shows prediction confidence with progress bar
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback during analysis
✅ **Reset Functionality** - Clear and analyze new images

## Project Structure

```
damage_detection/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Component styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
├── backend/
│   ├── main.py             # FastAPI backend
│   └── ...
└── model/
    └── model.keras         # Trained model
```

## Setup Instructions

### 1. Prerequisites

- Node.js 14+ and npm installed
- Backend API running at `http://127.0.0.1:8000`

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `react` & `react-dom` - React library
- `axios` - HTTP client for API requests
- `react-scripts` - Build tools

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Creates optimized production build in `/build` directory

## API Integration

The frontend communicates with the backend at:
- **Endpoint**: `http://127.0.0.1:8000/predict`
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Request**: Form data with key `file` containing the image

### Response Format

**Success (200)**
```json
{
  "damage": "Yes" or "No",
  "confidence": 0.85
}
```

**Error**
```json
{
  "error": "Error message"
}
```

## Component Overview

### `App.js` - Main Component

**State Management:**
- `selectedFile` - Currently selected file
- `preview` - Image preview data URL
- `loading` - Loading state during API call
- `result` - Analysis result
- `error` - Error messages

**Key Functions:**
- `handleFileChange()` - Handle file selection and validation
- `handleUpload()` - Send image to API and process response
- `handleReset()` - Clear all data and results

**Features:**
- Image validation (only accepts image files)
- FormData preparation for multipart upload
- Error handling with user-friendly messages
- Loading spinner during analysis
- Dynamic result display with styling

## Styling

### Card Layout
- Centered container with full-screen background
- White card with shadow and rounded corners
- Responsive padding and spacing

### Color Scheme
- **Primary**: `#667eea` (Purple)
- **Damage (Red)**: `#ef4444`
- **Safe (Green)**: `#22c55e`
- **Background**: Gradient purple to blue

### Responsive Breakpoints
- Tablet: `768px`
- Mobile: `640px`

## Usage

1. **Upload Image**
   - Click the upload area or drag-and-drop
   - Only image files are accepted
   - Preview appears immediately

2. **Analyze**
   - Click "🔍 Analyze Image" button
   - Wait for processing (loading state shows)
   - Results appear below

3. **View Results**
   - Damage status with color coding
   - Confidence percentage with progress bar
   - Click "🔄 Analyze Another Image" to start over

## Error Handling

- **No file selected** - Shows error message
- **Invalid file type** - Only images accepted
- **API failure** - Displays backend error or generic message
- **Network issues** - User-friendly error messages

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding Features

To add new features:

1. Add state variables if needed
2. Create new handler functions
3. Update the JSX structure
4. Style using the existing styles object

### Example: Add a new field

```javascript
const [newField, setNewField] = useState(null);

const handleNewAction = () => {
  // Your logic here
  setNewField(value);
};
```

## Troubleshooting

### Backend connection errors
- Ensure FastAPI backend is running on `http://127.0.0.1:8000`
- Check CORS settings in backend if running on different port

### Image preview not showing
- Check if browser supports FileReader API
- Verify image file is valid

### Results not displaying
- Check browser console for errors (F12)
- Ensure backend is returning correct JSON format

## Performance

- Lazy image loading
- Efficient state management
- Optimized re-renders with hooks
- Responsive image preview

## Security

- File type validation on frontend
- Backend should validate file types
- CORS headers configured on backend
- No sensitive data in frontend

## Future Enhancements

- [ ] Batch image processing
- [ ] History of analyses
- [ ] Map view of damage locations
- [ ] Export results as PDF
- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] Save to database

## License

MIT License

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify backend API is running
4. Check network tab for API requests

---

**Built with ❤️ using React and FastAPI**
