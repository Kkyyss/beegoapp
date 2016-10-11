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

export default class AddAdminDialog extends Component {
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
      if (!userData.fullPermission) {
        $('#admin-permission').parent().remove();
      }
      var userContactNo = $('#admin-contact-no');
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
    $('#admin-c').val(thisObj.state.value);

    var addUserForm = $('#add-admin-form');
    var userContactNo = $('#admin-contact-no');
    userContactNo.val(userContactNo.intlTelInput("getNumber"));
    ajax({
      url: "/user/admin-console",
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
          wrapFunc.AlertStatus('Success', 'Admin Added Successfully!', 'success', true, true);
        }
        thisObj.setState({
          btnDisabled: false,
        });        
        return;
      }
    });    
  };

  getUserList() {
    var thisObj = this;

    var searchBox = $('#search-box');
    ajax({
      url: "/api/view-admin-list",
      method: "POST",
      cache: false,
      beforeSend: function() {
        wrapFunc.LoadingSwitch(true);
      },
      success: function(res) {
        wrapFunc.LoadingSwitch(false);
        if (res.error != null) {
          $('#errMsg').text(res.error);
        } else {
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetAdminDataSource(res.data);
          wrapFunc.PaginateAdminContent(res.data);
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
            id="add-admin-btn"
            iconClassName="fa fa-user-plus"
            style={styles.button}
            onTouchTap={this.handleOpen}
          />
          <Dialog
            title="Add Admin"
            className="add-admin-dialog"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <form id="add-admin-form" style={styles.formStyle} className="add-admin-style">
              <div>Campus&nbsp;
              <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                <MenuItem value={"ALL"} primaryText="ALL" />
                <MenuItem value={"IU"} primaryText="IU" />
                <MenuItem value={"IICS"} primaryText="IICS" />
                <MenuItem value={"IICKL"} primaryText="IICKL" />
                <MenuItem value={"IICP"} primaryText="IICP" />
              </DropDownMenu>
              <input id="admin-c" name="admin-c" type="text" style={styles.hide} />
              <TextField
                id="admin-name"
                name="admin-name"
                floatingLabelText="Full Name"
                type="text"
                fullWidth={true}
              />
              <TextField
                id="admin-email"
                name="admin-email"
                floatingLabelText="Email"
                type="email"
                fullWidth={true}
              />
              <TextField
                id="admin-uid"
                name="admin-uid"
                floatingLabelText="Admin ID"
                type="text"
                fullWidth={true}
              />
              <br/><br/>
              <p className="form-paragraph">Contact No.</p>
              <input
                id="admin-contact-no"
                name="admin-contact-no"
                type="tel"
              />
              <br/><br/>
              <p className="form-paragraph">Role & Permissions</p>
              <Toggle
                id="admin-activated"
                name="admin-activated"
                label="Activated"
                defaultToggled={true}
                style={styles.toggle}
              />
              <Toggle
                id="admin-permission"
                name="admin-permission"
                label="Full Permission"
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
