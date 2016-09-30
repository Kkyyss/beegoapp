import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {redA700} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

require('./CSS/animate.css');
require('./CSS/sweetalert2.min.css');
// require('./CSS/scrollbar/jquery.mCustomScrollbar.css');
require('./CSS/backup.css');
require('./JS/wrapperFunc.js');

var $ = window.Jquery;
var moment = window.Moment;
require("jquery-mousewheel")($);
// require('malihu-custom-scrollbar-plugin')($);

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
    color: 'white',
    cursor: 'pointer',
  },
  clickableItem: {
    cursor: 'pointer',
  },
  hide: {
    display: 'none',
  },
  header: {
    top: '0px',
    left: '0px',
    position: 'fixed',
    backgroundColor: redA700,
  },
  sidebarTitle: {
    height: 64,
    width: 250,
    display: 'inline-block',
    backgroundColor: redA700,
  },
  balanceStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttonSize: {
    margin: '4px 15px 0 0',
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
      appbarTitle: '',
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

  userConsole = (event) => {
    this.redirectUrl(event, "/user/user-console");
  };

  userRequestConsole = (event) => {
    this.redirectUrl(event, "/user/request");
  };

  userBookedRoomConsole = (event) => {
    this.redirectUrl(event, "/user/booked-room");
  };

  downloadAccommodation = (event) => {
    event.preventDefault();
    _gaq.push(['_trackEvent', 'Download', 'Accommodation', '7z']);
    var req = new XMLHttpRequest();
    req.open("GET", "/static/download/Accommodation.7z", true);
    req.responseType = "blob";

    req.onload = function (e) {
      var blob = req.response;
      var link=document.createElement('a');
      link.href=window.URL.createObjectURL(blob);
      link.download="Accommodation.7z";
      link.click();
    };

    req.send();
    
    // window.open("/static/download/Accommodation.7z");
  }

  logout = (event) => {
    event.preventDefault();
    this.delete_cookie("_AUTH");
    $(location).prop('href', '/');
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
    $('#log-gplus, #reg-gplus, #log-facebook, #reg-facebook').on('click', providerRequest);

    function providerRequest() {
      var idName = $(this).attr('name');
      $(location).attr('href', "/auth/"+ idName + "?provider=" + idName);
    }
    
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd ' +
               'oanimationend animationend';
    var ajax = $.ajax;
    var wrapFunc = window.Wrapper;
    var url_path = $(location).attr('pathname');
    var thisObj = this;

    IsLogined(url_path)

    // $('#card-wrapper').mCustomScrollbar({
    //   autoHideScrollbar: true,
    //   theme: "minimal-dark",
    //   documentTouchScroll: true,
    //   mouseWheel:{ preventDefault: true }
    // });
    $('.left-drawer-scrollbar, #card-wrapper, .right-drawer-scrollbar').mousewheel(function(event, delta, deltaX, deltaY){
      event.preventDefault();
      if (delta < 0) $(this).scrollTop($(this).scrollTop() + 55);
      else if (delta > 0) $(this).scrollTop($(this).scrollTop() - 55);
      return false;
    });

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
              appbarTitle: 'IHMS',
            });
            // $('#sidebar-admin-console, #sidebar-user-item, #sidebar-room-item').next().remove();
            $(".left-drawer-scrollbar, #user-btn").remove();
            $('#card-wrapper').removeClass('wrapper-margin');
            $('#footer').removeClass('footer-margin');
            // $(window).unbind('window:resize', this.updateDimensions);
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
            var userId  = userInfo.id;
            var isAdmin = userInfo.isAdmin;
            var dateJoined = userInfo.dateJoined;
            var avatarURL = userInfo.avatar;
            var isAccount = request.getResponseHeader('IsAccount');
            var isForm = request.getResponseHeader("IsForm");
            var provider = userInfo.provider;
            var email = userInfo.email;
            var campus = userInfo.campus;
            var studentId = userInfo.studentId;
            var activated = userInfo.activated;
            var username = userInfo.name;
            var userLocation = userInfo.location;
            var gender = userInfo.gender;
            var contactNo = userInfo.contactNo;
            var status = (activated) ? "Activated" : "Inactivated";
            var fillUpProfile = userInfo.fillUpProfile;
            // /user
            switch (urlPath) {
              case '/user/admin-console':
                if (!isAdmin) {
                  $(location).prop('href', '/user');
                }
                break;
              case '/user/booking-form':
                if (!fillUpProfile) {
                  $('#form-content').remove();
                } else {
                  $('#form-warning').remove();
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
            }
            if (isUser === 'TRUE') {
              $('#account-item').remove();
              $('#reg-gplus').parent().remove();

              // if (campus !== 'ALL') {
              //   var campusItem = $('#campus-item').next()
              //   var item = campusItem.find('.' + campus).detach();
              //   campusItem.empty().append(item);
              // }

              document.title += ' ' + username;
              $('#sidebar-user-avatar, #user-avatar, #menu-avatar').attr('src', avatarURL);
              // /user/account
              if (isAccount === 'TRUE') {
                if (provider) {
                  $('#password-tab').remove();
                  $('#account-tab')
                  .css('width', '100%')
                  .parent()
                  .next()
                  .children()
                  .css('width', '100%');
                } else {
                  $('#password-email').val(email);
                }
                if (activated) {
                  $('#resend-btn').remove();
                }
                $('#joined-date').text(moment(dateJoined).format('MMMM Do YYYY'));
                $('#user-img').attr('src', avatarURL);
                $('#status').text(status);
                $('#user-provider').val(provider);
                $('#user-campus').val(campus);
                $('#reg-email').val(email);
                $('#student-id').val(studentId);
                $('#user-name').val(username);
                $('#user-location').val(userLocation);
                switch (gender) {
                  case 'Male':
                    $('input[name=user-gender]')[0].click();
                    break;
                  case 'Female':
                    $('input[name=user-gender]')[1].click();
                    break;
                  default: break;
                }
                $('#user-tel-no').text(contactNo);
              }
              if (isForm === 'TRUE') {
                $('#form-user-id').val(userId);
              }
            }
          }
        },
        error:function (request, ajaxOptions, thrownError){
        },
        complete: function() {
          $(".preload").addClass("animated bounceOut").one(animationEnd, function() {
            $(this).remove();         
            $(".universe").removeClass('universe').addClass('animated fadeIn').one(animationEnd, function() {
              $(this).removeClass('animated fadeIn');
              if (url_path.indexOf("/login_register") >= 0) {
                var cookieValue = getLoginErrorCookieValue();
                if (cookieValue.length != 0) {
                  var ifrm=document.createElement('iframe');
                  ifrm.setAttribute("src", "https://accounts.google.com/logout");
                  ifrm.style.display = "none";
                  document.body.appendChild(ifrm);
                  ifrm.parentNode.removeChild(ifrm);
                  thisObj.delete_cookie('_gothic_session');
                  wrapFunc.AlertStatus(
                    'Oopss...',
                    cookieValue,
                    'error',
                    false,
                    false
                  );
                }
                thisObj.delete_cookie('LOGIN_ERROR');
              }
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
                <a onTouchTap={this.accessHome} style={styles.link}>IHMS</a>
              </div>
            </Paper>
            <Subheader>Admin</Subheader>
            <ListItem
              id="sidebar-admin-console"
              primaryTogglesNestedList={true}
              initiallyOpen={true}
              leftIcon={<FontIcon className="fa fa-certificate" />}
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="Room Types"
                  leftIcon={<FontIcon className="fa fa-th" />}
                  href="/user/room-type"
                />,
                <ListItem
                  key={2}
                  primaryText="Room"
                  leftIcon={<FontIcon className="fa fa-h-square" />}
                  onTouchTap={this.roomConsole}
                />,
                <ListItem
                  key={3}
                  primaryText="Request"
                  leftIcon={<FontIcon className="fa fa-list-ul" />}
                  onTouchTap={this.requestConsole}
                />,
                <ListItem
                  key={4}
                  primaryText="Booked Room"
                  leftIcon={<FontIcon className="fa fa-bed" />}
                  onTouchTap={this.bookedRoomConsole}
                />,
                <ListItem
                  key={5}
                  primaryText="User"
                  leftIcon={<FontIcon className="fa fa-users" />}
                  onTouchTap={this.userConsole}
                />
              ]}
            >
              Console
            </ListItem>
            <Divider />
            <Subheader>Room</Subheader>
            <ListItem
              id="sidebar-room-item"
              primaryTogglesNestedList={true}
              initiallyOpen={true}
              leftIcon={<FontIcon className="fa fa-certificate" />}
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="Status"
                  onTouchTap={this.accessRoomStatus}
                  leftIcon={<FontIcon className="fa fa-user" />}
                />
              ]}
            >
              Console
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
                  primaryText="Account"
                  onTouchTap={this.accessUserAccount}
                  leftIcon={<FontIcon className="fa fa-user" />}
                />,
                <ListItem
                  key={2}
                  primaryText="Booking Form"
                  leftIcon={<FontIcon className="fa fa-file-text" />}
                  href="/user/booking-form"
                />,
                <ListItem
                  key={3}
                  primaryText="Request"
                  leftIcon={<FontIcon className="fa fa-list-ul" />}
                  onTouchTap={this.userRequestConsole}
                />,
                <ListItem
                  key={4}
                  primaryText="Booked Room"
                  leftIcon={<FontIcon className="fa fa-bed" />}
                  onTouchTap={this.userBookedRoomConsole}
                />,
                <ListItem
                  key={5}
                  primaryText="Sign Out"
                  onTouchTap={this.logout}
                  leftIcon={<FontIcon className="fa fa-sign-out" />}
                />,
              ]}
            >
             Console
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
              primaryTogglesNestedList={true}
              leftIcon={<FontIcon className="fa fa-download" />}
              nestedItems = {[
                <ListItem
                  key={1}
                  primaryText="Accommodation.7z"
                  onTouchTap={this.downloadAccommodation}
                />
              ]}
            >Download
            </ListItem>
          </Drawer>
          <AppBar
            title={<span 
              style={styles.clickableItem} 
              onClick={this.accessHome}
            >{this.state.appbarTitle}
            </span>}
            showMenuIconButton={this.state.showMenuIcon}
            onLeftIconButtonTouchTap={this.handleToggle}
            style={styles.header}
            iconElementRight={
              <div style={styles.balanceStyle}>
              <UserDropDownMenu />
                <RaisedButton
                  id="reg-gplus"
                  name="gplus"
                  label="Login"
                  fullWidth={true}
                  labelColor="white"
                  style={styles.button}
                  backgroundColor="#d34836"
                  icon={<FontIcon className="fa fa-google-plus-official whitify" />}
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
