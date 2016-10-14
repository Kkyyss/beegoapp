import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {yellow400} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import FlatButton from 'material-ui/FlatButton';
import {
  IndexRoute,
  IndexLink,
  Link
} from 'react-router';

require('./CSS/animate.css');
require('./CSS/sweetalert2.min.css');
require('./CSS/backup.css');
require('./JS/wrapperFunc.js');

var $ = window.Jquery;
var moment = window.Moment;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;

require('./JS/jquery.fittext.js');
require('./JS/jquery.lettering.js');
require('./JS/jquery.textillate.js');

import Footer from './Footer'

import UserDropDownMenu from './User/UserDropDownMenu'

const styles = {
  marginTopCover: {
    marginTop: '16px',    
  },
  link: {
    textDecoration: 'none',
    marginLeft: '10%',
    fontSize: '30px',
    color: 'black',
    cursor: 'pointer',
  },
  clickableItem: {
    cursor: 'pointer',
    color: 'black',
  },
  hide: {
    display: 'none',
  },
  header: {
    top: '0px',
    left: '0px',
    position: 'fixed',
    backgroundColor: yellow400,
  },
  sidebarTitle: {
    height: 64,
    width: 250,
    display: 'inline-block',
    backgroundColor: yellow400,
  },
  balanceStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttonSize: {
    margin: '4px 15px 0 0',
  },
  labelStyle: {
    color: '#d34836',
    // color: 'white',
  },
  button: {
    margin: '5px 10px 0 0',
  },
  black: {
    color: 'black !important',
  },
};

let docked = false;
export default class Master extends Component {
   constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      open: false,
      showMenuIcon: true,
    };
  }

  handleToggle = () => this.setState({open: !this.state.open});

  accessHome = (event) => {
    this.redirectUrl(event, "/");
  };

  accessLoginRegister = (event) => {
    this.redirectUrl(event, "/login_register");
  };

  accessUserAccount = (event) => {
    this.redirectUrl(event, "/user/account");
  };

  accessRoomStatus = (event) => {
    this.redirectUrl(event, "/user/room-status");
  }

  roomConsole = (event) => {
    this.redirectUrl(event, "/user/room-console");
  };

  requestConsole = (event) => {
    this.redirectUrl(event, "/user/request-console");
  };

  bookedRoomConsole = (event) => {
    this.redirectUrl(event, "/user/booked-room-console");
  };

  notificationConsole = (event) => {
    this.redirectUrl(event, "/user/notification-console");
  };  

  userConsole = (event) => {
    this.redirectUrl(event, "/user/user-console");
  };

  adminConsole = (event) => {
    this.redirectUrl(event, "/user/admin-console");
  };

  userRequestConsole = (event) => {
    this.redirectUrl(event, "/user/request");
  };

  userBookedRoomConsole = (event) => {
    this.redirectUrl(event, "/user/booked-room");
  };

  userNotificationConsole = (event) => {
    this.redirectUrl(event, "/user/notifications");
  }

  accessDownloads = (event) => {
    this.redirectUrl(event, "/user/downloads");
  }

  logout = (event) => {
    event.preventDefault();
    wrapFunc.LoadingSwitch(true);
    this.delete_cookie("_AUTH");
    var ifrm=document.createElement('iframe');
    ifrm.setAttribute("src", "https://accounts.google.com/logout");
    ifrm.style.display = "none";
    document.body.appendChild(ifrm);
    // ifrm.parentNode.removeChild(ifrm);
    setTimeout(function() {
      $(location).prop('href', '/');
    }, 2000);
  };

  delete_cookie = (cookieName) => {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  redirectUrl = (event, url) => {
    event.preventDefault();
    $(location).prop('href', url);
  }

  updateDimensions() {
    if ($(window).width() > 767) {
      docked = true;
      this.setState({
        open: true, 
      });
    } else {
      docked = false;
      this.setState({
        open: false,
      });
    }
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount(){
    $('#log-gplus, #reg-gplus').on('click', providerRequest);

    function providerRequest() {
      var idName = $(this).attr('name');
      $(location).attr('href', "/auth/"+ idName + "?provider=" + idName);
    }
    
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd ' +
               'oanimationend animationend';

    var url_path = $(location).attr('pathname');
    var thisObj = this;

    IsLogined(url_path)

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    wrapFunc.ResizeChanging();
    $(window).on('window:resize', wrapFunc.ResizeChanging);
    $(window).on('window:resize', this.updateDimensions);
    
    $('#log-recap').addClass('hide');


    function IsLogined(urlPath) {
      ajax({
        url: urlPath,
        method: "GET",
        async: false,
        cache: false,
        success: function(res, ts, request) {
          if (request.getResponseHeader('IsLogined') === 'FALSE') {
            thisObj.setState({
              showMenuIcon: false,
            });

            $(".left-drawer-scrollbar, #user-btn").remove();
            $('#card-wrapper').removeClass('wrapper-margin');
            $('#footer').removeClass('footer-margin');

            // /login_register
            if (request.getResponseHeader('recap') === 'TRUE') {
              $('#log-recap').removeClass('hide').addClass('show');
            }
          } else {
            var isUser = request.getResponseHeader("IsUser");
            var tokenString = JSON.parse(request.getResponseHeader("User"));
            var userInfo = tokenString.user;
            console.log(userInfo);
            wrapFunc.SetUpUser(userInfo);
            var isAdmin = userInfo.isAdmin;
            var userId  = userInfo.id;
            var avatarURL = userInfo.avatar;
            var isAccount = request.getResponseHeader('IsAccount');
            // var isForm = request.getResponseHeader("IsForm");
            var email = userInfo.email;
            var campus = userInfo.campus;
            var studentId = userInfo.studentId;
            var adminId = userInfo.adminId;
            var activated = userInfo.activated;
            var username = userInfo.name;
            var gender = userInfo.gender;
            var contactNo = userInfo.contactNo;
            var balance = userInfo.balance;
            var status = (activated) ? "Activated" : "Inactivated";
            var userType = (isAdmin) ? "Admin" : "Student";
            var fillUpProfile = userInfo.fillUpProfile;
            // /user
            switch (urlPath) {
              case '/user/admin-console': 
              case '/user/user-console': 
              case '/user/room-type':
              case '/user/room-console':
              case '/user/request-console':
              case '/user/booked-room-console':
                if (!isAdmin) {
                  $(location).prop('href', '/user');
                }
                break;
              case '/user/booking-form':
                if (isAdmin) {
                  $(location).prop('href', '/user');
                }
                if (!fillUpProfile) {
                  $('#form-content').remove();
                } else {
                  $('#form-warning-profile').remove();
                }
                break;
              case '/user/account':
                if (isAdmin) {
                  $('#student-id').parent().next().remove();
                  $('#student-id, #user-gender, #user-balance').parent().remove();
                  $('#admin-id').val(adminId);
                } else {
                  $('#admin-id').parent().next().remove();
                  $('#admin-id').parent().remove();
                  $('#student-id').val(studentId);
                  $('#user-gender').val(gender.charAt(0).toUpperCase() + gender.slice(1));
                }
                if (isAccount === 'TRUE') {
                  $('#user-type').text(userType);
                  $('#user-img').attr('src', avatarURL);
                  $('#status').text(status);
                  $('#user-campus').val(campus);
                  $('#reg-email').val(email);
                  $('#user-name').val(username);

                  $('#user-tel-no').text(contactNo);
                }
                break;
              case '/user/request':
              case '/user/booked-room':
                if (isAdmin) {
                  $(location).prop('href', '/user');
                }
                break;
              default: break;
            }
            // if (urlPath === '/user/admin-console' && !isAdmin) {
              
            // }
            if (!isAdmin) {
              var sidebarAdmin = $('#sidebar-admin-console').parent();
              sidebarAdmin.prev().remove();
              sidebarAdmin.remove();
            } else {
              $('#sidebar-user-item, #campus-item, #sidebar-download').parent().prev().remove();
              $('#sidebar-user-item, #campus-item, #sidebar-download').parent().remove();
            }
            if (isUser === 'TRUE') {
              $('#reg-gplus').remove();
              $('#appbar-title').remove();
              // if (campus !== 'ALL') {
              //   var campusItem = $('#campus-item').next()
              //   var item = campusItem.find('.' + campus).detach();
              //   campusItem.empty().append(item);
              // }

              document.title += ' ' + username;
              $('#sidebar-user-avatar, #sidebar-admin-avatar, #user-avatar, #menu-avatar').attr('src', avatarURL);

              // if (isForm === 'TRUE') {
              //   $('#form-user-id').val(userId);
              // }
            }
          }
        },
        error:function (request, ajaxOptions, thrownError){
        },
        complete: function() {
          wrapFunc.LoadingSwitch(true);
          $(".preload").addClass("animated fadeOut").one(animationEnd, function() {
            $(this).remove();
            $(".universe").removeClass('universe').addClass('animated fadeIn').one(animationEnd, function() {
              $(this).removeClass('animated fadeIn');
              var cookieValue = getLoginErrorCookieValue();
              if (cookieValue.length != 0) {
                var ifrm=document.createElement('iframe');
                ifrm.setAttribute("src", "https://accounts.google.com/logout");
                ifrm.style.display = "none";
                document.body.appendChild(ifrm);
                thisObj.delete_cookie('_gothic_session');
                thisObj.delete_cookie('LOGIN_ERROR');
                setTimeout(function() {
                  wrapFunc.LoadingSwitch(false);
                  ifrm.parentNode.removeChild(ifrm);
                  wrapFunc.AlertStatus(
                    'Oopss...',
                    cookieValue,
                    'error',
                    false,
                    false
                  );
                }, 2000);
              }
              wrapFunc.LoadingSwitch(false);
            });
          });
        }
      });

      function getLoginErrorCookieValue() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)LOGIN_ERROR\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      }
    }

    this.forceUpdate();
  }

  render() {
    return (
        <MuiThemeProvider>
          <div>
          <Drawer
            containerClassName="left-drawer-scrollbar"
            docked={docked}
            width={250}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <Paper
              style={styles.sidebarTitle}
              zDepth={1}
            >
              <div style={styles.marginTopCover }>
                <a onTouchTap={this.accessHome} style={styles.link}>
                <img src="../static/img/logo.png" width="64x64" />IHMS
                </a>
              </div>
            </Paper>
            <Subheader>Admin</Subheader>
            <ListItem
              id="sidebar-admin-console"
              primaryTogglesNestedList={true}
              initiallyOpen={true}
              leftAvatar={
                <Avatar
                  id="sidebar-admin-avatar"
                  src="/"
                  size={36}
                />
              }
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="Account"
                  onTouchTap={this.accessUserAccount}
                  leftIcon={<FontIcon className="fa fa-user" />}
                />,
                <ListItem
                  key={2}
                  primaryText="Room Status"
                  onTouchTap={this.accessRoomStatus}
                  leftIcon={<FontIcon className="fa fa-pie-chart" />}
                />,
                <ListItem
                  key={3}
                  primaryText="Room Types"
                  leftIcon={<FontIcon className="fa fa-th" />}
                  href="/user/room-type"
                />,
                <ListItem
                  key={4}
                  primaryText="Room"
                  leftIcon={<FontIcon className="fa fa-h-square" />}
                  onTouchTap={this.roomConsole}
                />,
                <ListItem
                  key={5}
                  primaryText="Request"
                  leftIcon={<FontIcon className="fa fa-list-ul" />}
                  onTouchTap={this.requestConsole}
                />,
                <ListItem
                  key={6}
                  primaryText="Booked Room"
                  leftIcon={<FontIcon className="fa fa-bed" />}
                  onTouchTap={this.bookedRoomConsole}
                />,
                <ListItem
                  key={7}
                  primaryText="Notifications"
                  leftIcon={<FontIcon className="fa fa-bell" />}
                  onTouchTap={this.notificationConsole}
                />,
                <ListItem
                  key={8}
                  primaryText="Student"
                  leftIcon={<FontIcon className="fa fa-users" />}
                  onTouchTap={this.userConsole}
                />,
                <ListItem
                  key={9}
                  primaryText="Admin"
                  leftIcon={<FontIcon className="fa fa-eye" />}
                  onTouchTap={this.adminConsole}
                />,                
                <ListItem
                  key={10}
                  primaryText="Sign Out"
                  onTouchTap={this.logout}
                  leftIcon={<FontIcon className="fa fa-sign-out" />}
                />,                
              ]}
            >
              Admin
            </ListItem>
            <Divider />
            <Subheader>User</Subheader>
            <ListItem
              id="sidebar-user-item"
              primaryTogglesNestedList={true}
              initiallyOpen={true}
              leftAvatar={
                <Avatar
                  id="sidebar-user-avatar"
                  src="/"
                  size={36}
                />
              }
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="Notifications"
                  leftIcon={<FontIcon className="fa fa-bell" />}
                  onTouchTap={this.userNotificationConsole}
                />,
                <ListItem
                  key={2}
                  primaryText="Room Status"
                  onTouchTap={this.accessRoomStatus}
                  leftIcon={<FontIcon className="fa fa-pie-chart" />}
                />,                
                <ListItem
                  key={3}
                  primaryText="Account"
                  onTouchTap={this.accessUserAccount}
                  leftIcon={<FontIcon className="fa fa-user" />}
                />,
                <ListItem
                  key={4}
                  primaryText="Request"
                  leftIcon={<FontIcon className="fa fa-list-ul" />}
                  onTouchTap={this.userRequestConsole}
                />,
                <ListItem
                  key={5}
                  primaryText="Booked Room"
                  leftIcon={<FontIcon className="fa fa-bed" />}
                  onTouchTap={this.userBookedRoomConsole}
                />,
                <ListItem
                  key={6}
                  primaryText="Sign Out"
                  onTouchTap={this.logout}
                  leftIcon={<FontIcon className="fa fa-sign-out" />}
                />,
              ]}
            >
             User
            </ListItem>
            <Divider />
            <Subheader>Campuses</Subheader>            
            <ListItem
              id="campus-item"
              primaryText="Campuses"
              primaryTogglesNestedList={true}
              leftIcon={<FontIcon className="fa fa-graduation-cap" />}
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="IU"
                  className="IU"
                  href="/user/inti-iu"
                />,
                <ListItem
                  key={2}
                  primaryText="IICS"
                  className="IICS"
                  href="/user/inti-iics"
                />,
                <ListItem
                  key={3}
                  primaryText="IICKL"
                  className="IICKL"
                  href="/user/inti-iickl"
                />,
                <ListItem
                  key={4}
                  primaryText="IICP"
                  className="IICP"
                  href="/user/inti-iicp"
                />
              ]}
            />
            <Divider />
            <Subheader>Resources</Subheader>            
            <ListItem
              id="sidebar-download"
              leftIcon={<FontIcon className="fa fa-download" />}
              onTouchTap={this.accessDownloads}
            >
            Downloads
            </ListItem>
          </Drawer>
          <AppBar
            title={<span
              style={styles.clickableItem}
              onClick={this.accessHome}
              id="appbar-title"
            >
            <img src="../static/img/logo.png" width="54x54" />
            IHMS
            </span>}
            showMenuIconButton={this.state.showMenuIcon}
            onLeftIconButtonTouchTap={this.handleToggle}
            iconClassNameLeft="fa fa-bars blackify"
            style={styles.header}
            iconElementRight={
              <div style={styles.balanceStyle}>
              <UserDropDownMenu />
                <FlatButton
                  id="reg-gplus"
                  name="gplus"
                  label="Login"
                  labelStyle={styles.labelStyle}
                  style={styles.button}
                  icon={<FontIcon className="fa fa-google-plus-official google-color" />}
                />
              </div>
            }
          />
          {this.props.children}
          <Footer />
          </div>
        </MuiThemeProvider>
    );
  }
}
