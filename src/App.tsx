import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import NavBarPages from "./pages/navBarPages";
import NavBarPages from "./pages/NavBarPages";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<NavBarPages />} />
      </Routes>
    </>
  );
}

export default App;
