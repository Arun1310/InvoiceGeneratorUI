// import Checkout from "./checkout/Checkout";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import InvoiceDetail from './InvoiceDetails';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invoiceDetail/:id" element={<InvoiceDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
