import React from "react";
import Navbar from "./navber";

function Header({ username }) {
  return (
    <header>
      <Navbar username={username} />
    </header>
  );
}

export default Header;
