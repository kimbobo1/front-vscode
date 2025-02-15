import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <--- 여기서 이미 Router 사용됨
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter> {/* 여기서 이미 Router 사용됨 */}
        <App />
    </BrowserRouter>
);
