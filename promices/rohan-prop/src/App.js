import React from "react";
import Header from "./header";

function App() {
  const username = "Rohan";

  return (
    <div>
      <Header username={username} />
    </div>
  );
}

export default App;
