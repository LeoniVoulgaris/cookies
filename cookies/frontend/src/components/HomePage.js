import React, { Component } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Signin from "./Signin";
import Hero from "./Hero";
import Menu from "./Menu";




export default class HomePage extends Component {   
  render() {
    return (
      <>
        <NavBar />
        <div><Hero /></div>
        <div><Menu /></div>

        <Footer />
      </>
    );
  }
}
