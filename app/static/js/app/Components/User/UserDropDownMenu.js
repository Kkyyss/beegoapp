import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
require('../JS/wrapperFunc.js');
var $ = window.Jquery;
var wrapFunc = window.Wrapper;
var AvatarUrl;
var Show;

const styles = {
  textCenter: {
    textAlign: 'center',
  },
  userMenu: {
    cursor: 'default',
    margin: '0',
  },
  menuContent: {
    textAlign: 'center',
    padding: '12px',
  },

  clear: {
    clear: 'both',
  },
  textWhite: {
    color: 'white',
  },
  chipStyle: {
    marginBottom: '5px',
  },
};

export default class UserDropDownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    AvatarUrl = window.UserData.avatar;

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  accessAccount = (event) => {
    this.redirectUrl(event, "/user/account");
  };

  logout = (event) => {
    var thisObj = this;
    wrapFunc.LoadingSwitch(true);
    thisObj.delete_cookie('_AUTH');    
    var ifrm=document.createElement('iframe');
    ifrm.setAttribute("src", "https://accounts.google.com/logout");
    ifrm.style.display = "none";
    document.body.appendChild(ifrm);
    // ifrm.parentNode.removeChild(ifrm);
    setTimeout(function() {
      thisObj.redirectUrl(event, "/");
    }, 3000);
  };

  delete_cookie = (cookieName) => {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  redirectUrl = (event, url) => {
    event.preventDefault();
    this.handleRequestClose();
    $(location).prop('href', url);
  };

  componentDidMount() {
    // $('#dropdownlist-avatar').attr('src', $('#user-avatar').attr('src'));
    // userAvatar = $('#user-avatar').attr('src');
  }

  render() {
    return (
      <div>
        <IconButton
          id="user-btn"
          onTouchTap={this.handleTouchTap}
        >
          <Avatar
            id="user-avatar"
            src="/"
            size={24}
            className="iconRound"
          />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem
              style={styles.userMenu}
              disabled={true}
            >
              <div style={styles.menuContent}>
                <Avatar 
                  id="menu-avatar"
                  src={AvatarUrl}
                  size={96}
                />
                <div>
                <FlatButton  
                  label="My Account"
                  onTouchTap={this.accessAccount}
                  labelStyle={styles.textWhite}
                  backgroundColor='#0091EA'
                  hoverColor='#40C4FF'
                  rippleColor='lightcyan'
                />
                </div>
              </div>
            </MenuItem>            
            <MenuItem 
              id="logout-btn" 
              primaryText="Sign Out"
              leftIcon={<FontIcon className="fa fa-sign-out" />}
              onTouchTap={this.logout}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
} 
