import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Signin from "./Signin";
import Hero from "./Hero";
import Contact from "./Contact";
import About from "./About";
import Menu from "./Menu";
import api from "../api";

const HomePage = () => {

  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    api.get("products")
      .then(res => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div><Hero /></div>
      <div><Menu  /></div>
      <div><About /></div>
      <div><Contact /></div>
      <Footer />
    </>
  );
};

export default HomePage;
