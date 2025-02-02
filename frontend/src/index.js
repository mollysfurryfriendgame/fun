import "./index.css";
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
      redirect_uri: window.location.origin + "/dashboard"
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>,
);
