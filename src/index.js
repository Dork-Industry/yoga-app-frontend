import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

// core styles
import "./scss/_main.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <HomePage />
    <ToastContainer/>
  </BrowserRouter>
);