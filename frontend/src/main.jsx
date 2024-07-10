import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "/src/styles/customTheme.jsx";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>,
  // </React.StrictMode>,
);
