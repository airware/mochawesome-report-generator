import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { MochawesomeReport } from 'components';
import hljs from 'highlight.js/lib/highlight';
import reportStore from './reportStore';

const bodyEl = document.querySelector('body');
const data = JSON.parse(bodyEl.getAttribute('data-raw'));
const config = JSON.parse(bodyEl.getAttribute('data-config'));

// Register hljs languages
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));

bodyEl.removeAttribute('data-raw');
bodyEl.removeAttribute('data-config');

// Set data in the store
reportStore.setInitialData({ data, config });

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <MochawesomeReport store={ reportStore } />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('report')
);
