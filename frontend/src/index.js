import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./styles/theme.css";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();