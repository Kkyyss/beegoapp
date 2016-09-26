import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AddUserDialog from "./UserComponents/AddUserDialog.js";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import "intl-tel-input/build/css/intlTelInput.css";

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;

import intlTelInput from 'intl-tel-input';

const styles = {
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '5%',
    width: '90%',
  },
  toggle: {
    marginBottom: 16,
  },
  toolBar: {
    backgroundColor: '#E1BEE7',
    paddingLeft: '10px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  inputStyle: {
    // border: 'none',
    fontSize: '20px',
    outline: 'none',
    border: 'none',
    margin: '10px 0 10px 0',
    padding: '0 10px 0 10px',
  },
  wall: {
    marginLeft: '10px',
  },
  contentStyle: {
    padding:'25px',
  },
  formStyle: {
    marginLeft: '25%',
    width: '50%',
  },  
  textCenter: {
    textAlign: 'center',
  },
  hide: {
    display: 'none',
  },
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
  },
  underlineStyle: {
    borderColor: '#1A237E',
  },
  underlineFocusStyle: {
    borderColor: 'transparent',
  },
  raisedButton: {
    marginBottom: 16,
  },  
};

export default class UserConsolePage extends Component {

  state = {
    value: "IU",
    disabled: false,
    btnDisabled: false,
  };

  handleChange = (event, index, value) => {
    this.changeCampus(value);
  };

  changeCampus(value) {
    this.setState({value});
  }    

  componentDidMount() {
    var thisObj = this;
    $.when().then(function(x) {
      userData = window.UserData;
      if (userData.campus !== 'ALL') {
        var userCampus = userData.campus;
        thisObj.setState({
          value: userCampus,
          disabled: true,
        });
      }
      console.log("Here");
      updateUserList();
    });

    function updateUserList() {
      var userState = {
        userCampus: userData.campus
      };
      ajax({
        url: "/api/view-users-list",
        method: "POST",
        cache: false,
        data: JSON.stringify(userState),
        beforeSend: function() {
          wrapFunc.LoadingSwitch(true);
        },
        success: function(res) {
          wrapFunc.LoadingSwitch(false);
          if (res.error != null) {
            $('#errMsg').text(res.error);
          } else {
            wrapFunc.SetUsersDataSource(res.data);
            wrapFunc.PaginateUsersContent(res.data);
          }
        }
      });
    }    

    var userContactNo = $('#edit-user-contact-no');
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
    });    

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    editUserResize();

    $(window).on('window:resize', editUserResize);

    function editUserResize() {
      var windowHeight = $(window).height();
      var editUserBox = $('#edit-user-box'); 
      var windowWidth = $(window).width();      
      editUserBox.width(windowWidth * 0.6);
      editUserBox.height(windowHeight * 0.8);
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      $('#bg-overlay, #edit-user-box').css('display', 'none');
    });

    $('#update-btn').on('click', updateUser);

    function updateUser(e) {
      e.preventDefault();
      thisObj.setState({
        btnDisabled: true,
      });
      var editUserForm = $('#edit-user-form');
      $('#edit-user-campus').val(thisObj.state.value);
      ajax({
        url: "/user/user-console",
        method: "PUT",
        data: editUserForm.serialize(),
        cache: false,
        beforeSend: function() {
        wrapFunc.LoadingSwitch(true);
        },
        success: function(res) {
          wrapFunc.LoadingSwitch(false);

          if (res.length != 0) {
            wrapFunc.AlertStatus(
              "Oops...",
              res,
              "error",
              false,
              false
            );
          } else {
            $('#bg-overlay, #edit-user-box').css('display', 'none');
            updateUserList();
            wrapFunc.AlertStatus(
              "Success",
              "Update successfully!",
              "success",
              true,
              true
            );
          }
          thisObj.setState({
            btnDisabled: false,
          });          
        }
      });      
    }
  }

  render() {
    return (
      <div>
        <div id="bg-overlay"></div>
        <Paper id="edit-user-box" zDepth={2}>
          <h1 style={styles.textCenter}>Edit User</h1>
          <hr/>
          <form id="edit-user-form" style={styles.formStyle} className="edit-user-style">
            <input id="edit-user-id" name="edit-user-id" type="text" style={styles.hide} />
            <div>Campus&nbsp;
            <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
              <MenuItem value={"ALL"} primaryText="ALL" />
              <MenuItem value={"IU"} primaryText="IU" />
              <MenuItem value={"IICS"} primaryText="IICS" />
              <MenuItem value={"IICKL"} primaryText="IICKL" />
              <MenuItem value={"IICP"} primaryText="IICP" />
            </DropDownMenu>
            <input id="edit-user-campus" name="edit-user-campus" type="text" style={styles.hide} />
            <TextField
              id="edit-user-name"
              name="edit-user-name"
              floatingLabelText="Full Name"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
            />
            <TextField
              id="edit-user-email"
              name="edit-user-email"
              floatingLabelText="Email"
              type="email"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}              
            />
            <TextField
              id="edit-user-location"
              name="edit-user-location"
              floatingLabelText="Permanent Address"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}              
            />
            <br/><br/>
            <p className="form-paragraph">Gender</p>
            <RadioButtonGroup name="edit-user-gender">
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
            <p className="form-paragraph">Contact No.</p>
            <input
              id="edit-user-contact-no"
              name="edit-user-contact-no"
              type="tel"
            />
            <br/><br/>
            <p className="form-paragraph">Role & Permissions</p>
            <Toggle
              id="edit-user-activated"
              name="edit-user-activated"
              label="Activated"
              defaultToggled={true}
              style={styles.toggle}
            />
            <Toggle
              id="edit-user-profiled"
              name="edit-user-profiled"
              label="Filled Up Profile"
              defaultToggled={false}
              style={styles.toggle}
            />
            <Toggle
              id="edit-user-admin"
              name="edit-user-admin"
              label="Admin"
              defaultToggled={false}
              style={styles.toggle}
            />              
            </div>
          </form> 

          <hr/>
          <div className="edit-user-content">
            <RaisedButton
              id="cancel-btn"
              label="Cancel"
              fullWidth={true}
              secondary={true}
              style={styles.raisedButton}
            />
            <RaisedButton 
              id="update-btn"
              label="Update"
              fullWidth={true}
              primary={true}
            />
          </div>          
        </Paper>      
        <div id="card-wrapper">
          <Card id="card" style={styles.cardSize}>
            <div style={styles.toolBar}>
              <ToolbarTitle text="User Console" />
              <ToolbarSeparator />
              <AddUserDialog/>
              <span style={styles.wall}></span>
              <input 
                id="search-box"
                placeholder="Search"
                style={styles.inputStyle}
              />   
            </div>
            <br/>
            <div style={styles.contentStyle}>
              <div id="errMsg" style={styles.textCenter}></div>
              <div id="pagination-content"></div>
              <br/>
              <div id="pagination-container"></div>
            </div>          
          </Card>
        </div>
      </div>
    );
  }
}
