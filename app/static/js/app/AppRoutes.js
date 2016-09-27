import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router'

import Master from './Components/Master';
import HomePage from './Components/Home/HomePage'

import LoginRegisterPage from './Components/LoginRegister/LoginRegisterPage';

import ForgotPasswordPage from './Components/ForgotPassword/ForgotPasswordPage';

import ResetPasswordPage from './Components/ResetPassword/ResetPasswordPage';

import UserPage from './Components/User/UserPage';
import UserAccountPage from './Components/User/UserAccountPage';
import UserRequestConsolePage from './Components/User/UserRequestConsolePage';
import RoomStatusPage from './Components/User/RoomStatusPage';

import RoomConsolePage from './Components/Admin/RoomConsolePage';
import RequestConsolePage from './Components/Admin/RequestConsolePage';
import BookedRoomConsolePage from './Components/Admin/BookedRoomConsolePage';
import UserConsolePage from './Components/Admin/UserConsolePage';

import FourZeroOnePage from './Components/Error/FourZeroOnePage';
import FourZeroFourPage from './Components/Error/FourZeroFourPage';
import FiveZeroZeroPage from './Components/Error/FiveZeroZeroPage';

import IUPage from './Components/INTI/IUPage.js';
import IICSPage from './Components/INTI/IICSPage.js';
import IICKLPage from './Components/INTI/IICKLPage.js';
import IICPPage from './Components/INTI/IICPPage.js';

import BookingFormPage from './Components/INTI/BookingFormPage.js';

const AppRoutes = (
  <Route path="/" component={Master}>
  	<IndexRoute component={HomePage} />
  	<Route path="login_register" component={LoginRegisterPage} />
  	<Route path="forgot_password" component={ForgotPasswordPage} />
    <Route path="reset_password/:token" component={ResetPasswordPage} />
    <Route path="user" component={UserPage} />
    <Route path="user/inti-iu" component={IUPage}/>
    <Route path="user/inti-iics" component={IICSPage}/>
    <Route path="user/inti-iickl" component={IICKLPage}/>
    <Route path="user/inti-iicp" component={IICPPage}/>
    <Route path="user/booking-form" component={BookingFormPage}/> 
    <Route path="user/account" component={UserAccountPage} />
    <Route path="user/room-console" component={RoomConsolePage} />
    <Route path="user/request-console" component={RequestConsolePage} />
    <Route path="user/booked-room-console" component={BookedRoomConsolePage} />
    <Route path="user/user-console" component={UserConsolePage} />
    <Route path="user/room-status" component={RoomStatusPage} />
    <Route path="user/request" component={UserRequestConsolePage} />
    <Route path="401" component={FourZeroOnePage}/>
    <Route path="404" component={FourZeroFourPage}/>
    <Route path="500" component={FiveZeroZeroPage}/>
  </Route>
);

export default AppRoutes;
