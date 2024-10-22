import * as React from 'react';
import { useState, useEffect,useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import getCheckoutTheme from './checkout/theme/getCheckoutTheme';
import AttributeMapping from './components/AttributeMapping';
import CustomInvoiceGenerator from './components/CustomInvoiceGenerate';

const steps = ['Attribute Mapping', 'Custom Invoice'];
function getStepContent(step, invoiceData, ref) {
  switch (step) {
    case 0:
      return <AttributeMapping invoiceData={invoiceData}/>;
    case 1:
      return <CustomInvoiceGenerator invoiceData={invoiceData} ref={ref} />;
    default:
      throw new Error('Unknown step');
  }
}
export default function InvoiceDetail() {
  const ref = useRef();
  // eslint-disable-next-line no-unused-vars
  const [mode, setMode] = useState('light');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchInvoiceById = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:44390/api/Invoice/${id}`);
      setInvoiceData(response.data);
      setLoading(false);
    } catch (err) {
      // setError("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {  
    fetchInvoiceById();
  }, [fetchInvoiceById]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleGoBack = () => {
    navigate('/'); 
  };
  
  const onClickGenerate = () => {
    ref.current.generateCustomInvoice();
    setActiveStep(activeStep + 1);
  };
  const onClickHome = () => {
    navigate('/'); 
  };
  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Button
           startIcon={<ChevronLeftRoundedIcon />}
            onClick={handleGoBack}
            variant="outlined"
            fullWidth
            // sx={{ display: { xs: 'flex', sm: 'none' } }}
            >Back
          </Button>
            <div class="px-60 pt-8">
                <Stepper
                    activeStep={activeStep}
                    sx={{ width: '100%', height: 40 }}
                >
                    {steps.map((label) => (
                        <Step
                        sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                        key={label}
                        >
                        <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{ display: { sm: 'flex', md: 'none' } }}
                >
                    {steps.map((label) => (
                    <Step
                        sx={{
                        ':first-child': { pl: 0 },
                        ':last-child': { pr: 0 },
                        '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                        }}
                        key={label}
                    >
                        <StepLabel
                        sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                        >
                        {label}
                        </StepLabel>
                    </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length ? (
                    <Stack spacing={2} useFlexGap>
                    <Typography variant="h1">📜</Typography>
                    <Typography variant="h5">Invoice Generated Successfully</Typography>
                    {/* <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your order number is
                        <strong>&nbsp;#140396</strong>. We have emailed your order
                        confirmation and will update you once its shipped.
                    </Typography> */}
                    <Button
                        variant="contained"
                        sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                        onClick={onClickHome}
                    >
                        Go to Home
                    </Button>
                    </Stack>
                ) : (
                    <React.Fragment>
                    {getStepContent(activeStep, invoiceData, ref)}
                    <Box
                        sx={[
                        {
                            display: 'flex',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            alignItems: 'end',
                            flexGrow: 1,
                            gap: 1,
                            pb: { xs: 12, sm: 0 },
                            mt: 3,
                            mb: '60px',
                        },
                        activeStep !== 0
                            ? { justifyContent: 'space-between' }
                            : { justifyContent: 'flex-end' },
                        ]}
                    >
                        {activeStep !== 0 && (
                        <Button
                            startIcon={<ChevronLeftRoundedIcon />}
                            onClick={handleBack}
                            variant="text"
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            Previous
                        </Button>
                        )}
                        {activeStep !== 0 && (
                        <Button
                            startIcon={<ChevronLeftRoundedIcon />}
                            onClick={handleBack}
                            variant="outlined"
                            fullWidth
                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                        >
                            Previous
                        </Button>
                        )}
                        {
                          activeStep === steps.length - 1 && 
                            <Button
                              variant="contained"
                              endIcon={<ChevronRightRoundedIcon />}
                              onClick={onClickGenerate}
                              sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                            >
                              Generate
                            </Button>
                        }
                         {
                          activeStep !== steps.length - 1 &&
                            <Button
                              variant="contained"
                              endIcon={<ChevronRightRoundedIcon />}
                              onClick={handleNext}
                              // disabled={invoiceData.state !== 2}
                              sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                            >
                              Next
                            </Button>
                        }
                    </Box>
                    </React.Fragment>
                )}
            </div>
    </ThemeProvider>
  );
}
