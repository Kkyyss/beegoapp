import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import "intl-tel-input/build/css/intlTelInput.css";
var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;

import intlTelInput from 'intl-tel-input';

const styles = {
  hide: {
    display: 'none',
  },
  formStyle: {
    marginLeft: '25%',
    width: '50%',
  },
  customWidth: {
    width: '100%',
  },
  toggle: {
    marginBottom: 16,
  },
  button: {
    margin: '0 5px 0 5px',
  },  
};

export default class AddUserDialog extends Component {
  state = {
    open: false,
    value: "IU",
    disabled: false,
    btnDisabled: false,
  };

  handleChange = (event, index, value) => {
    this.changeCampus(value);
  };

  handleOpen = (e) => {
    this.setState({open: true}, afterOpened);

    function afterOpened(){
      var userContactNo = $('#user-contact-no');
      userContactNo.intlTelInput({
        initialCountry: "auto",
        geoIpLookup: function(callback) {
          $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
            var countryCode = (resp && resp.country) ? resp.country : "";
            callback(countryCode);
          });
        },
        utilsScript: "../static/js/utils.js", // just for formatting/placeholders etc
        dropdownContainer: "body"
      });
    }
  };

  handleClose = (e) => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    thisObj.setState({
      btnDisabled: true,
    });
    $('#user-c').val(thisObj.state.value);

    var addUserForm = $('#add-user-form');
    var userContactNo = $('#user-contact-no');
    userContactNo.val(userContactNo.intlTelInput("getNumber"));
    ajax({
      url: "/user/user-console",
      method: "POST",
      data: addUserForm.serialize(),
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
          thisObj.setState({open: false});
          thisObj.getUserList();
          wrapFunc.AlertStatus('Success', 'User Added Successfully!', 'success', true, true);
        }
        thisObj.setState({
          btnDisabled: false,
        });        
        return;
      }
    });    
  };

  togglePermission = (e) => {
    $('#user-permission').parent().toggleClass('hide');
  };

  getUserList() {
    var thisObj = this;

    var userState = {
      userCampus: userData.campus
    };

    var searchBox = $('#search-box');
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
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetUsersDataSource(res.data);
          wrapFunc.PaginateUsersContent(res.data);
        }
      }
    });
  }
  sortByLatest(a, b) {
    var av = a.TimeStamp;
    var bv = b.TimeStamp;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }  

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
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        id="submit-btn"
        label="Go!"
        primary={true}
        onClick={this.handleSubmit}
        disabled={this.state.btnDisabled}
      />,
    ];

    return (
      <div>
          <IconButton
            id="add-user-btn"
            iconClassName="fa fa-user-plus"
            style={styles.button}
            onTouchTap={this.handleOpen}
          />
          <Dialog
            title="Add User"
            className="add-user-dialog"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <form id="add-user-form" style={styles.formStyle} className="add-user-style">
              <div>Campus&nbsp;
              <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                <MenuItem value={"ALL"} primaryText="ALL" />
                <MenuItem value={"IU"} primaryText="IU" />
                <MenuItem value={"IICS"} primaryText="IICS" />
                <MenuItem value={"IICKL"} primaryText="IICKL" />
                <MenuItem value={"IICP"} primaryText="IICP" />
              </DropDownMenu>
              <input id="user-c" name="user-c" type="text" style={styles.hide} />
              <TextField
                id="user-name"
                name="user-name"
                floatingLabelText="Full Name"
                type="text"
                fullWidth={true}
              />
              <TextField
                id="user-email"
                name="user-email"
                floatingLabelText="Email"
                type="email"
                fullWidth={true}
              />
              <br/><br/>
              <p className="form-paragraph">Gender</p>
              <RadioButtonGroup name="user-gender">
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
                id="user-contact-no"
                name="user-contact-no"
                type="tel"
              />
              <br/><br/>
              <p className="form-paragraph">Role & Permissions</p>
              <Toggle
                id="user-activated"
                name="user-activated"
                label="Activated"
                defaultToggled={true}
                style={styles.toggle}
              />
              <Toggle
                id="user-profiled"
                name="user-profiled"
                label="Filled Up Profile"
                defaultToggled={false}
                style={styles.toggle}
              />
              </div>
            </form>
          </Dialog>
      </div>
    );
  }
}
