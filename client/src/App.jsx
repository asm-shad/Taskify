import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register></Register>}></Route>
      </Routes>
    </>
  );
};

export default App;
