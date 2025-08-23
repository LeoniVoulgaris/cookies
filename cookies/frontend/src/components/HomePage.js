import React, { Component } from "react";
import ProductPage from "./Products";
<<<<<<< HEAD
import NavBar from "./NavBar";
=======
import {BrowserRouter as Router, Route, Routes, Switch, Link, Redirect} from 'react-router-dom';
>>>>>>> 22b49a559feaea68bdea7658d566c2c9e68bf132



export default class HomePage extends Component {   
  render() {
    return (
<<<<<<< HEAD
      <div>
        <NavBar />
      </div>
=======
      <Router>
        <Routes>
          <Route exact path="/" element={<p>This is the home page</p>} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </Router>
>>>>>>> 22b49a559feaea68bdea7658d566c2c9e68bf132
    );
  }
}
