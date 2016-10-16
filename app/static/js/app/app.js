import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory } from 'react-router';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
<<<<<<< Updated upstream
=======
// import {createHistory, createHashHistory} from 'history';
>>>>>>> Stashed changes

injectTapEventPlugin();

render(
  <Router 
    history={browserHistory}
  >
    {AppRoutes}
  </Router>,
  document.getElementById('app')
);
