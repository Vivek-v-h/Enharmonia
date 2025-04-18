import React from "react";
import ReactDOM from "react-dom/client";  // Use this for React 18 and above
import { Provider } from "react-redux";
import store from "./redux/store"; // Import the Redux store
import App from "./App";
import "./index.css";

// Create the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using the new method
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
