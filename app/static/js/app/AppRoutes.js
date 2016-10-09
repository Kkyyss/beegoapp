import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router'

import Master from './Components/Master';
import HomePage from './Components/Home/HomePage'

import LoginRegisterPage from './Components/LoginRegister/LoginRegisterPage';

import UserPage from './Components/User/UserPage';
import UserAccountPage from './Components/User/UserAccountPage';
import UserRequestConsolePage from './Components/User/UserRequestConsolePage';
import UserBookedRoomPage from './Components/User/UserBookedRoomPage';
import RoomStatusPage from './Components/User/RoomStatusPage';
// import UserNotificationConsolePage from './Components/User/UserNotificationConsolePage';

import RoomConsolePage from './Components/Admin/RoomConsolePage';
import RequestConsolePage from './Components/Admin/RequestConsolePage';
import BookedRoomConsolePage from './Components/Admin/BookedRoomConsolePage';
import UserConsolePage from './Components/Admin/UserConsolePage';
import AdminConsolePage from './Components/Admin/AdminConsolePage';
import RoomTypeConsolePage from './Components/Admin/RoomTypeConsolePage';
import NotificationConsolePage from './Components/Admin/NotificationConsolePage';

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
    <Route path="user/admin-console" component={AdminConsolePage} />
    <Route path="user/notification-console" component={NotificationConsolePage} />
    <Route path="user/booked-room" component={UserBookedRoomPage} />
    <Route path="user/room-type" component={RoomTypeConsolePage} />
    <Route path="user/room-status" component={RoomStatusPage} />
    <Route path="user/request" component={UserRequestConsolePage} />
    <Route path="401" component={FourZeroOnePage}/>
    <Route path="404" component={FourZeroFourPage}/>
    <Route path="500" component={FiveZeroZeroPage}/>
  </Route>
);

export default AppRoutes;
