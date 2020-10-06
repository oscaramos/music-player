import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components'

import App from './App';
import GlobalStyles from './globalStyles'
import { darkTheme } from './Themes'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
