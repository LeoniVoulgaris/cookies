import React from "react";
import MenuCard from "../layouts/MenuCard";
import menu1 from "../assets/img/menu1.jpg";
import menu2 from "../assets/img/menu2.jpg";
import menu3 from "../assets/img/menu3.jpg";
import menu4 from "../assets/img/menu4.jpg";
import menu5 from "../assets/img/menu5.jpg";
import menu6 from "../assets/img/menu6.jpg";


const Menu = ({ products }) => {
  return(
    <section className = "py-5" id="menu">
      <h4 style={{textAlign: "center"}}>Our Menu</h4>
      <div className="container px-4 px-lg-5 mt-5">
        <div className = "row justify-content-center">
          <MenuCard products={products} />
        </div>
      </div>
    </section>
  );
};

export default Menu;