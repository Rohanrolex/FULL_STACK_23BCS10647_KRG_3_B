import React from "react";
import UserProfile from "./userprofile";

function Navbar({ username }) {
  return (
    <nav>
      <UserProfile username={username} />
    </nav>
  );
}

export default Navbar;
