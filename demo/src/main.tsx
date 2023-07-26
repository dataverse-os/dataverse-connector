import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Wagmi from "./Wagmi";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/wagmi' element={<Wagmi />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
