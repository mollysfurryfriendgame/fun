import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css'; // Keep your custom styles below Bootstrap to override styles if needed
import "./global.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-uurrj85hw68pf4zr.us.auth0.com"
    clientId="DFyECL8KvY8mENQVUhizo6rf3UhMGPxI"
    authorizationParams={{
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin + "/profile"
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>,
);
