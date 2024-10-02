import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getCheckoutTheme from './theme/getCheckoutTheme';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Home from '../Home';

export default function Checkout() {
  const [mode, setMode] = useState('light');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState('');

  // Handle file upload and preview
  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);

      // Create a preview using FileReader for PDFs
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result);
      };
      reader.readAsDataURL(file); // Convert the PDF to base64
    } else {
      alert('Please select a valid PDF file');
    }
  };

  // Handle drag-and-drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/pdf',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleFile(file);
    },
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPdfPreview('');
  };
  // This code only runs on the client side, to determine the system color preference
  useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
    <CssBaseline enableColorScheme />
    <Grid container sx={{ height: { xs: '100%', sm: '100dvh' } }}>
      <Grid
        size={{ xs: 4 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderRight: { sm: 'none', md: '1px solid' },
          borderColor: { sm: 'none', md: 'divider' },
          alignItems: 'start',
          pt: 4,
          px: 10,
          gap: 4,
        }}
      >
        {/* <SitemarkIcon /> */}
        <div className="flex flex-row gap-2">
          <ReceiptIcon color="primary"/>
          <Typography sx={{ 
              color: 'hsl(210, 98%, 48%)',
              fontFamily: 'monospace',
              fontSize: '1rem'
            }}
          >
            Invoice Generator
          </Typography>
        </div>
        <div className="flex flex-col items-center p-6">
      <Typography variant="h5" className="mb-4 font-mono text-lg">
        Upload Your PDF
      </Typography>

      {/* Drag-and-Drop Zone */}
      <div
        {...getRootProps()}
        className={`w-64 h-32 border-2 border-dashed rounded-md cursor-pointer flex items-center justify-center mb-4 ${
          isDragActive ? 'border-blue-500' : 'border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography className="text-blue-500">Drop the PDF here...</Typography>
        ) : (
          <Typography className="text-gray-500">
            Drag & drop a PDF here, or click to select
          </Typography>
        )}
      </div>

      {/* Upload Button */}
      <IconButton
        color="primary"
        component="label"
        className="mb-4"
        aria-label="upload pdf"
      >
        <CloudUploadIcon fontSize="large" />
        <input
          type="file"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
          accept="application/pdf"
        />
      </IconButton>

      {/* Preview Section */}
      {pdfPreview && (
        <div className="flex flex-col items-center mt-4">
          <Typography variant="subtitle1" className="mb-2 font-mono">
            PDF Preview:
          </Typography>

          {/* Display the PDF in an iframe for preview */}
          <iframe
            src={pdfPreview}
            title="PDF Preview"
            width="300"
            height="400"
            className="border"
          />

          {/* Provide a download link for the PDF */}
          <a
            href={pdfPreview}
            download={selectedFile?.name}
            className="mt-4 text-blue-500 underline"
          >
            Download PDF
          </a>

          {/* Button to remove the selected file */}
          <Button
            variant="outlined"
            color="error"
            className="mt-4"
            onClick={handleRemoveFile}
          >
            Remove
          </Button>
        </div>
      )}

      {!pdfPreview && (
        <Typography className="mt-4 text-gray-500 font-mono">
          No file selected
        </Typography>
      )}
    </div>
      </Grid>
      <Grid
        size={{ xs: 8 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          pt: 10,
          px: 10,
          gap: 4,
        }}
      >
        <Home />
      </Grid>
    </Grid>
  </ThemeProvider>
  );
}
