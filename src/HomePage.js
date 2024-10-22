import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { saveAs } from 'file-saver';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { DataGrid  } from '@mui/x-data-grid';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import axios from 'axios';
import { Chip } from '@mui/material';
import getCheckoutTheme from './checkout/theme/getCheckoutTheme';

function ShowStatus({ item }) {
  const handleStatusClick = () => {
    console.log('Chip clicked');
  };

  let label, color;
  switch (item.state) {
    case 0:
      label = 'Processing';
      color = 'warning';
      break;
    case 1:
      label = 'Processed';
      color = 'warning';
      break;
    case 2:
      label = 'Attribute Mapped';
      color = 'info';
      break;
      case 3:
        label = 'Completed';
        color = 'success';
        break;
    default:
      label = 'Unknown';
      color = 'default';
  }

  return <Chip label={label} color={color} onClick={handleStatusClick} />;
}

function DownLoadInvoiceFile({ item }) {
  const { state, customGeneratedInvoiceUrl, fileName } = item;
  const handleDownloadClick = async () => {
      saveAs(customGeneratedInvoiceUrl, fileName);
  };

  return (
      <Tooltip title="Download Invoice">
          <IconButton
              color="info"
              onClick={(event) => {
                  event.stopPropagation();
                  handleDownloadClick();
              }}
              disabled={state !== 3}
          >
              <FileCopyIcon />
          </IconButton>
      </Tooltip>
  );
}

export default function HomePage() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState('');
  
  const columns = [
    { field: 'fileName', headerName: 'Invoice', flex: 1 },
    { field: 'state', headerName: 'Status', flex: 1,
      renderCell: (params) => {
        return (
            <ShowStatus
                item={params.row}
            />
        );
    }
     },
     {
      field: 'customGeneratedInvoiceUrl',
      headerName: 'Download Invoice',
      headerClassName: 'header',
      disableClickEventBubbling: true,
      filterable: false,
      flex: 1,
      // renderHeader: () => (
      //     <div>
      //         <FileCopyIcon />
      //     </div>
      // ),
      renderCell: (params) => {
          return <DownLoadInvoiceFile item={params.row} />;
      }
  },
    //  { field: 'file', headerName: 'Download File', flex: 1 },
  ];

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:44390/api/Invoice");
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      // setError("Error fetching invoices");
    } finally {
      // setLoading(false);
    }
  };
  
  useEffect(() => {  
    fetchInvoices();
  }, []);

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

  const handleUploadFile = async () => {
    if (!selectedFile) {
      // setErrorMessage("Please select a file to upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post("https://localhost:44390/api/Invoice/Upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      handleRemoveFile();
      fetchInvoices();
    } catch (error) {
    } finally {
    }
  };

  const handleRowClick = (params) => {
    if(params.row.state === 3) return;
    const id = params.row.id;
    navigate(`/invoiceDetail/${id}`); 
  };

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
          <div className="mt-4 w-full flex flex-col items-center justify-center">
              <Typography class="mb-4 text-md">
                  Upload Your Invoice
              </Typography>

              {/* Drag-and-Drop Zone */}
              <div
                  {...getRootProps()}
                  className={`w-full h-32 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center mb-4 ${
                  isDragActive ? 'border-blue-500' : 'border-gray-400'
                  }`}
              >
                  <input {...getInputProps()} />
                  <div class="w-full flex flex-col justify-center items-center">
                      <CloudUploadIcon fontSize="small" className="text-gray-500" />
                      {isDragActive ? (
                      <Typography className="text-blue-500">Drop the PDF here...</Typography>
                      ) : (
                      <Typography className="text-gray-500">
                          Drag & drop a PDF here, or click to select
                      </Typography>
                      )}
                  </div>
                
              </div>

              {/* Preview Section */}
              {pdfPreview && (
                  <div className="flex flex-col items-center mt-2">
                <Typography class="mb-4 text-md">
                      PDF Preview
                  </Typography>

                  {/* Display the PDF in an iframe for preview */}
                  <iframe
                      src={pdfPreview}
                      title="PDF Preview"
                      width="300"
                      height="400"
                      className="border"
                  />
                  <div>
                  <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRemoveFile}
                      sx={{ m: 2 }}
                  >
                      Remove
                  </Button>
                  <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleUploadFile}
                      sx={{ m: 2 }}
                  >
                      Upload
                  </Button>
                  </div>
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
            pt: 14,
            px: 10,
            gap: 4,
          }}
        >
          <div style={{ height: 500, width: '100%' }}>
        <DataGrid 
          onRowClick={handleRowClick}
          rows={invoices} 
          columns={columns} 
          loading={loading} 
          sx={{
              '& .MuiDataGrid-root': {
                // backgroundColor: '#f0f0f0', // Background color of the grid
              },
              '& .MuiDataGrid-cell': {
                // borderBottom: '1px solid #d9d9d9', // Border between rows
                borderRight: '1px solid #d9d9d9',  // Border between columns
                // borderLeft: '1px solid #d9d9d9',
                // color: '#1976d2', // Text color of cells
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#d9d9d9',
              },
            }} 
        />
      </div>
        </Grid>
      </Grid>
  </ThemeProvider>
  );
}
