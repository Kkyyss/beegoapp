import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';

var $ = window.Jquery;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }, 
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '5%',
    width: '90%',
  },
  cardWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  contentPadding: {
    paddingLeft: '25%',
    paddingRight: '25%',
  },
  gridList: {
    marginTop: 24,
    width: '80%',
    height: '100%',
    marginBottom: 24,
  },
  button: {
    marginRight: 12,
  },
  gridTile: {
    boxShadow: '10px 10px 5px #888888',
  },
  textCenter: {
    textAlign: 'center',
  },
  topdownPadding: {
    padding: '30px 0',
  },
  black: {
    backgroundColor: 'black',
  },
  red: {
    backgroundColor: 'red',
  },  
};

export default class UserPage extends Component {
  accessUserAccount = (event) => {
    this.redirectUrl(event, "/user/account");
  };

  accessRoomStatus = (event) => {
    this.redirectUrl(event, "/user/room-status");
  };

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
  };

  accessDownloads = (event) => {
    this.redirectUrl(event, "/user/downloads");
  };  

  accessRoomTypes = (event) => {
    this.redirectUrl(event, "/user/room-type");
  };

  accessIU = (event) =>{
    this.redirectUrl(event, "/user/inti-iu");
  };

  accessIICS = (event) =>{
    this.redirectUrl(event, "/user/inti-iics");
  };

  accessIICKL = (event) =>{
    this.redirectUrl(event, "/user/inti-iickl");
  };

  accessIICP = (event) =>{
    this.redirectUrl(event, "/user/inti-iicp");
  };

  redirectUrl = (event, url) => {
    event.preventDefault();
    $(location).prop('href', url);
  };

  componentDidMount() {
    document.cookie = '_gothic_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  render() {
    return (
      <div>
        <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
          <div id="admin-home">
            <Card id="card" style={styles.cardSize}>
              <Tabs 
                tabItemContainerStyle={styles.black}
                inkBarStyle={styles.red}
              >
                <Tab label="Admin Panel" >            
                  <div style={styles.topdownPadding}>
                    <div className="block-center">
                    <div className="grid">
                      <div className="user-ac" onTouchTap={this.accessUserAccount}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Account</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="room-status" onTouchTap={this.accessRoomStatus}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Room Status</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="room-types" onTouchTap={this.accessRoomTypes}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Room Types</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="room" onTouchTap={this.roomConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Room</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="request" onTouchTap={this.requestConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Request</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="booked" onTouchTap={this.bookedRoomConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Booked Room</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="notification" onTouchTap={this.notificationConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Notification</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="student" onTouchTap={this.userConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Student</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="admin" onTouchTap={this.adminConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Admin</h1>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card>
          </div>
          <div id="user-home">
            <Card id="u-card" style={styles.cardSize}>
              <Tabs 
                tabItemContainerStyle={styles.black}
                inkBarStyle={styles.red}
              >
                <Tab label="User Panel" >
                  <div style={styles.topdownPadding}>
                    <div className="block-center">
                    <div className="grid">
                      <div className="user-ac" onTouchTap={this.accessUserAccount}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Account</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="notification" onTouchTap={this.userNotificationConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Notification</h1>
                        </div>
                      </div>
                    </div>                    
                    <div className="grid">
                      <div className="room-status" onTouchTap={this.accessRoomStatus}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Room Status</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="request" onTouchTap={this.userRequestConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Request</h1>
                        </div>
                      </div>
                    </div>
                    <div className="grid">
                      <div className="booked" onTouchTap={this.userBookedRoomConsole}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>Booked Room</h1>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </Tab>
                <Tab label="Available Campuses" >
                  <div style={styles.topdownPadding}>
                    <div className="block-center">
                    <div className="camp-grid">
                      <div className="iu" onTouchTap={this.accessIU}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>IU</h1>
                        </div>
                      </div>
                    </div>
                    <div className="camp-grid">
                      <div className="iics" onTouchTap={this.accessIICS}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>IICS</h1>
                        </div>
                      </div>
                    </div>
                    <div className="camp-grid">
                      <div className="iickl" onTouchTap={this.accessIICKL}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>IICKL</h1>
                        </div>
                      </div>
                    </div>
                    <div className="camp-grid">
                      <div className="iicp" onTouchTap={this.accessIICP}>
                        <div className="footer-overlay">
                          <h1 style={styles.textCenter}>IICP</h1>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
