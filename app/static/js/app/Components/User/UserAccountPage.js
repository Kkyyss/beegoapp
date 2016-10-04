import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import {amber500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import "intl-tel-input/build/css/intlTelInput.css";

var $ = window.Jquery;
var swal = window.SweetAlert;
var userData;

import intlTelInput from 'intl-tel-input';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },  
  clear: {
    clear: 'both',
  },
  buttonPos: {
    float: 'right',
  },
  hide: {
    display: 'none',
  },
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '10%',
    width: '80%',
  },
  textCenter: {
    textAlign: 'center',
  },
  paragraphStyle: {
    fontSize: '12px',
    textAlign: 'center',
  },
  cardWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  contentPadding: {
    padding: '20px 20% 0 20%',
  },
  imgSize: {
    height: '128px',
    width: '128px',
  },
  tabStyle: {
    backgroundColor: amber500,
  },
  clear: {
    clear: 'both',
  },
  buttonPos: {
    float: 'right',
  },
  leftSide: {
    float: 'left',
  },
  buttonMarginWithRight: {
    float: 'right',
    margin: '6px',
  },
  statusStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipStyle: {
    padding: '6px',
    margin: 5,
  },
  adminStatusStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },  
  adminChipStyle: {
    color: 'white',
    padding: '6px',
    margin: 5,
  }, 
  locationStyle: {
    width: 'auto',
  },
  oneLine: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
    fontSize: '18px',
  },  
};

export default class UserAccountPage extends Component {
  constructor(props) {
    super(props);

    this._openFileDialog = this._openFileDialog.bind(this);
    this.state = {
      chipBgColor: "",
    };
  }

  _openFileDialog = () => {
    var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  };

  componentDidMount() {
    var thisObj = this;
    $.when().then(function(x) {
      userData = window.UserData;
      console.log(userData);
      if (userData.isAdmin) {
        $('#student-id').parent().next().remove();
        $('#student-id').parent().remove();
        thisObj.setState({
          chipBgColor: "#D50000",
        });
      } else {
        thisObj.setState({
          chipBgColor: "#304FFE",
        });
      }
    });

    function detectBrowser() {
      var useragent = navigator.userAgent;
      var mapdiv = $('#map');

      if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.css('width', '80%');
        mapdiv.css('height', '450px');
      } else {
        mapdiv.css('width', '80%');
        mapdiv.css('height', '450px');
      }
    }

    $('#location-btn').on('click', showLocationDialog);
    function showLocationDialog(ev) {
      ev.preventDefault();
      $('#bg-overlay, #location-box').css('display', 'block');
      google.maps.event.trigger(map, "resize");
    }
    $('#cls-loc-btn').on('click', function() {
      $('#bg-overlay, #location-box').css('display', 'none');
    });
    var userContactNo = $('#user-contact-no');
    userContactNo.intlTelInput({
      initialCountry: "auto",
      geoIpLookup: function(callback) {
        $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
          var countryCode = (resp && resp.country) ? resp.country : "";
          callback(countryCode);
        });
      },
      utilsScript: "../static/js/utils.js", // just for formatting/placeholders etc
      dropdownContainer: "body"
    }).done(function() {
      userContactNo.val($('#user-tel-no').text());
      $('#user-tel-no').remove();
    });

    

    var ajax = $.ajax;
    var wrapFunc = window.Wrapper;
    var isValid = false;
    var acBtn = $('#account-submit-btn');
    var acForm = $('form[name="account"]');
    acBtn.click(submitAccount);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(acForm);
    
    console

    function submitAccount(e) {
      e.preventDefault();
      var finalValidation = validFunc(usernameVrf()) &
                            validFunc(locationVrf()) & 
                            validFunc(genderVrf()) &
                            validFunc(contactVrf());
               // & validFunc(phoneVrf());
      if (!finalValidation) {
        return false;
      }

      userContactNo.val(userContactNo.intlTelInput("getNumber"));
      userLocation.val(userLocation.val().trim());
      var formData = new FormData(acForm[0]);
      ajax({
        url   : "/user/account",
        method  : "PUT",
        data  : formData,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function() {
          wrapFunc.LockScreen(acBtn, acForm, true);
        },
        success: function(res, ts, request) {
          if (!res) {
            var tokenString = JSON.parse(request.getResponseHeader("User"));
            var userInfo = tokenString.user;
            var avatarURL = userInfo.avatar;
            var username = userInfo.name;
            var d = new Date();        
            $('#sidebar-user-avatar, #user-avatar').attr('src', avatarURL + '?' + d.getTime());
            $('#user-img').attr('src', avatarURL + '?' + d.getTime());
            $('#user-name').val(username);
            wrapFunc.LockScreen(acBtn, acForm, false);
            swal({
              title: 'Success',
                text:
                  "Your account has been updated successfully!",
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).done();
          } else {
            wrapFunc.LockScreen(acBtn, acForm, false);
            wrapFunc.AlertStatus(
              'Oops...',
              res,
              'warning',
              false,
              false
            );
            return;
          }
        }
      });
      return;
    }

    var username = $('#user-name');
    var userMsg = $('#userMsg');
    username.on({
      'input focusout': usernameVrf,
    });

    function usernameVrf() {
      var plainText = username.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/^[a-zA-Z\s]{1,}$/),
        userMsg,
        "Please don't leave it empty.",
        username
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        username, 
        userMsg, 
        "Please don't leave it empty."
      );
    }

    var userGender = $('input[name=user-gender]');
    var genderMsg = $('#genderMsg');
    userGender.on({
      'click': genderVrf,
    });

    function genderVrf() {
      if ($('input[name=user-gender]:checked').length == 0) {
        isValid = wrapFunc.BasicValidation(
          false,
          genderMsg,
          "Please select your gender.",
          userGender
        );
        return;
      } else {
        isValid = true;
        wrapFunc.MeetRequirement(
          userGender, 
          genderMsg, 
          "Please select your gender."
        );
      }
    }


    var contactMsg = $('#contactMsg');
    userContactNo.on({
      'input focusout': contactVrf,
    });

    function contactVrf() {
      isValid = wrapFunc.BasicValidation(
        $.trim(userContactNo.val()),
        contactMsg,
        "Please don't leave it empty.",
        userContactNo
      );
      if (!isValid) {
        return;
      }
      isValid = wrapFunc.BasicValidation(
        userContactNo.intlTelInput("isValidNumber"),
        contactMsg,
        "Invalid phone number.",
        userContactNo
      );
      if (!isValid) {
        return;
      }      
      wrapFunc.MeetRequirement(
        userContactNo, 
        contactMsg, 
        "Please don't leave it empty."
      );
    }


    var userLocation = $('#user-location');
    var locationMsg = $('#locationMsg');
    userLocation.on({
      'input focusout': locationVrf,
    })

    function locationVrf() {
      var plainText = userLocation.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText.length != 0),
        locationMsg,
        "Please don't leave it empty.",
        userLocation
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        userLocation, 
        locationMsg, 
        "Please don't leave it empty."
      );
    }

    var userUploadImg = $('#user-upload-img');

    userUploadImg.on('change', imageValidator);

    function imageValidator(e) {
      if (!e.target.files[0]) {
        wrapFunc.AlertStatus(
          'Oops...',
          "BOBO",
          'warning',
          false,
          false
        );
        userUploadImg.val("");
      } else if (e.target.files[0].size > 51200) {
        wrapFunc.AlertStatus(
          'Oops...',
          "More than 51.2kb",
          'warning',
          false,
          false
        );
        userUploadImg.val("")
      }
    }

    function validFunc(func) {
      func;
      if (isValid) {
        return true;
      }
      return false;
    }
    
    this.forceUpdate();
  }

  render() {
    return (
      <div>
      <div id="bg-overlay"></div>
      <div id="location-box">
        <div className="location-content">
          <TextField
            fullWidth={true}
            placeholder="Location"
            type="text"
            id="pac-input"
            name="pac-input"
          />        
          <div id="map"></div>
          <br/>
          <div>
          <RaisedButton
            primary={true}
            label="Go!"
            id="loc-btn"
            style={styles.buttonMarginWithRight}
          />
          <RaisedButton
            secondary={true}
            label="cancel"
            id="cls-loc-btn"
            style={styles.buttonMarginWithRight}
          />
          </div>
          <div style={styles.clear}></div>
        </div>
      </div>
      <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
        <Card id="card" name="account-card" style={styles.cardSize}>
          <Tabs>
            <Tab
              id="account-tab"
              style={styles.tabStyle}
              icon={<FontIcon className="fa fa-user" />}
              label="Account"
            >
              <div >
                <div className="card-content" style={styles.contentPadding}>
                  <form name="account" encType="multipart/form-data">
                    <div style={styles.textCenter}><i>Joined on <span id="joined-date"></span></i></div>
                    <br/>
                    <div style={styles.textCenter}>
                      <Avatar
                        id="user-img"
                        src="/"
                        size={128}
                      />
                      <br/><br/>
                      <div>
                      <RaisedButton
                        label="Upload Avatar"
                        secondary={true}
                        onTouchTap={this._openFileDialog}
                        icon={<FontIcon className="fa fa-picture-o" />}
                      />
                      <input
                        ref="fileUpload"
                        type="file"
                        style={styles.hide}
                        id="user-upload-img"
                        name="user-upload-img"
                        accept="image/*"
                      />
                      </div>
                    </div>
                          <br/><br/>
                          <div style={styles.statusStyle}>
                            <Chip backgroundColor={this.state.chipBgColor} style={styles.adminChipStyle} id="user-type" ></Chip>
                            <Chip style={styles.chipStyle} id="status"></Chip>
                          </div>
                          <TextField
                            style={styles.hide}
                            id="user-provider"
                            name="user-provider"
                            type="hidden"
                            readOnly={true}
                          />
                          <TextField
                            floatingLabelText="Campus"
                            floatingLabelFixed={true}
                            fullWidth={true}
                            id="user-campus"
                            name="user-campus"
                            type="text"
                            readOnly={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                          />
                          <br/>
                          <TextField
                            floatingLabelText="Email"
                            floatingLabelFixed={true}
                            fullWidth={true}
                            id="reg-email"
                            name="reg-email"
                            type="email"
                            readOnly={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                          />
                          <br/>
                          <TextField
                            floatingLabelText="Student ID"
                            floatingLabelFixed={true}
                            fullWidth={true}
                            id="student-id"
                            name="student-id"
                            type="text"
                            readOnly={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                          />
                          <br/>
                          <TextField
                            floatingLabelText="Full Name"
                            floatingLabelFixed={true}
                            fullWidth={true}
                            id="user-name"
                            name="user-name"
                            type="text"
                            readOnly={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                          />
                          <div id="userMsg">Please don't leave it empty.</div>
                          <br/>
                          <p className="form-paragraph">Gender</p>
                          <RadioButtonGroup name="user-gender" style={styles.oneLine}>
                            <RadioButton
                              value="Male"
                              label="Male"
                            />
                            <RadioButton
                              value="Female"
                              label="Female"
                            />
                          </RadioButtonGroup>
                          <br/>
                          <div id="genderMsg">Please select your gender.</div>
                          <br/>
                          <span style={styles.hide} id="user-tel-no"></span>
                          <p className="form-paragraph">Contact No.</p>
                          <input
                            id="user-contact-no"
                            name="user-contact-no"
                            type="tel"
                          />
                          <br/><br/>
                          <div id="contactMsg">Please don't leave it empty.</div>
                          <div>
                            <TextField
                              id="user-location"
                              name="user-location"
                              floatingLabelText="Permanent Address"
                              floatingLabelFixed={true}
                              style={styles.locationStyle}
                              type="text"
                              floatingLabelStyle={styles.floatingLabelStyle}
                            />
                            <IconButton
                              id="location-btn"
                              name="location-btn"
                              iconClassName="fa fa-map-marker"
                              tooltip="Map"
                              tooltipPosition="top-center"
                            />
                          </div>
                          <div id="locationMsg">Please don't leave it empty.</div>
                          <br/>
                  </form>
                  <br/>
                  <Divider />
                  <CardActions>
                    <RaisedButton
                      fullWidth={true}
                      primary={true}
                      label="Go!"
                      id="account-submit-btn"
                    />            
                  </CardActions>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </div>
      </div>
    );
  }
}
