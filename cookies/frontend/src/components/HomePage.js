import React, { Component } from "react";
import ProductPage from "./Products";
import {BrowserRouter as Router, Route, Routes, Switch, Link, Redirect} from 'react-router-dom';



export default class HomePage extends Component {   
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<p>This is the home page</p>} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </Router>
    );
  }
}
