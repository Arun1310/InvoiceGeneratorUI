import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import getCheckoutTheme from './checkout/theme/getCheckoutTheme';
import InvoiceView from './components/InvoiceView';
import AttributeMapping from './components/AttributeMapping';
import CustomInvoiceGenerator from './components/CustomInvoiceGenerate';

const steps = ['Invoice Viewer', 'Attribute Mapping', 'Generate Invoice'];
function getStepContent(step) {
  switch (step) {
    case 0:
      return <InvoiceView />;
    case 1:
      return <AttributeMapping />;
    case 2:
      return <CustomInvoiceGenerator />;
    default:
      throw new Error('Unknown step');
  }
}
export default function InvoiceDetail() {
  const [mode, setMode] = useState('light');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
            <div class="px-60 pt-14">
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
                    <Typography variant="h1">📦</Typography>
                    <Typography variant="h5">Thank you for your order!</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your order number is
                        <strong>&nbsp;#140396</strong>. We have emailed your order
                        confirmation and will update you once its shipped.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                    >
                        Go to my orders
                    </Button>
                    </Stack>
                ) : (
                    <React.Fragment>
                    {getStepContent(activeStep)}
                    <Box
                        sx={[
                        {
                            display: 'flex',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            alignItems: 'end',
                            flexGrow: 1,
                            gap: 1,
                            pb: { xs: 12, sm: 0 },
                            mt: { xs: 2, sm: 0 },
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
                        <Button
                        variant="contained"
                        endIcon={<ChevronRightRoundedIcon />}
                        onClick={handleNext}
                        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                        >
                        {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
                        </Button>
                    </Box>
                    </React.Fragment>
                )}
            </div>
    </ThemeProvider>
  );
}
