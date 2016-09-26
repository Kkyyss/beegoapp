import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory, useRouterHistory } from 'react-router';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {createHistory, createHashHistory} from 'history';

injectTapEventPlugin();

render(
  <Router 
    history={browserHistory}
  >
    {AppRoutes}
  </Router>,
  document.getElementById('app')
);
