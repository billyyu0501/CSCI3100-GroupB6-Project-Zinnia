import React from 'react';
import ReactDom from 'react-dom';
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import {BrowserRouter} from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDom.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"));