import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Hero from "./Hero";
import Contact from "./Contact";
import About from "./About";
import Menu from "./Menu";
import api from "../api";

const HomePage = () => {

  const [products, setProducts] = React.useState([]);
  const location = useLocation();

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

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.state]);

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
