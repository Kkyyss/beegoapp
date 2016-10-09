import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import AddUserDialog from "./UserComponents/AddUserDialog.js";
import "intl-tel-input/build/css/intlTelInput.css";

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;
var options = [];
var optionsIndex = [1];

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
  toolBarItem: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '0 15px 0 15px',
  },
  balanceStyle: {
    display: 'flex',
    marginBottom: 15,
  },
  inputStyle: {
    // border: 'none',
    fontSize: '20px',
    outline: 'none',
    border: 'none',
    margin: '0 15px 0 15px',
    padding: '15px 10px 15px 40px',
  },
  wall: {
    margin: '0 10px 0 10px',
  },
  contentStyle: {
    padding:'25px',
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    padding: '10px 0 5px 0',
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
  button: {
    margin: '0 5px 0 5px',
  },
  optionButton: {
    marginRight: 15,
  },
  checkbox: {
    marginBottom: 16,
  },
  optionContentStyle: {
    padding: 20,
  },
  rightAlign: {
    float: 'right',      
    margin: 10,
  },
  bottomLine: {
    borderBottom: '1px solid #a4a4a6',
  },
  clearFix: {
    clear: 'both',
  },
  textLeft: {
    textAlign: 'left',
  },
};

export default class UserConsolePage extends Component {

  state = {
    value: "IU",
    disabled: false,
    btnDisabled: false,
    refreshBtnDisabled: false,
    optionDialogOpen: false,
    optionsButton: false,
    sortValue: "Campus",
  };

  handleChange = (event, index, value) => {
    this.changeCampus(value);
  };

  handleSortTypeChange = (event, index, value) => {
    this.setState({
      sortValue: value,
    });
  };

  handleOptionDialogOpen = (e) => {
    this.setState({
      optionDialogOpen: true,
    }, function() {
      $.each(optionsIndex, function(index, value) {
        if (value == 1) {
          $($('#options-group').children()[index]).children().click();
        }
      });
    });
  };
  handleOptionDialogClose = (e) => {
    this.setState({
      optionDialogOpen: false,
    });
  };

  handleSearchOptionSubmit = (e) => {
    this.setState({
      optionsButton: true,
    })
    options = [];
    optionsIndex = [];
    if ($("#sr-id").is(":checked")) {
      options.push("StudentId");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#sr-campus").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#sr-permission').is(":checked")) {
      options.push("FullPermission");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#sr-name').is(':checked')) {
      options.push("Name");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#sr-location').is(':checked')) {
      options.push("Location");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#sr-contactNo').is(':checked')) {
      options.push("ContactNo");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    wrapFunc.SetUpUserSearchOption(options);
    this.setState({
      optionDialogOpen: false,
      optionsButton: false,
    });    
  };

  refreshList = (e) => {
    var thisObj = this;
    thisObj.setState({
      refreshBtnDisabled: true,
    });
    thisObj.updateUserList();
    $.when().then(function() {
      thisObj.setState({
        refreshBtnDisabled: false,
      });
    });
  }  

  sortByCampus(a, b) {
    var aCampus = a.Campus.toLowerCase();
    var bCampus = b.Campus.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
  }

  changeCampus(value) {
    this.setState({value});
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      if (userData.campus !== 'ALL') {
        var userCampus = userData.campus;
        thisObj.setState({
          value: userCampus,
          disabled: true,
        });
      }
      thisObj.updateUserList();
    });

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
      var dialogContentHeight = editUserBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);
    }
    var dialogCollection = $('#bg-overlay, #edit-user-box');
    $('#bg-overlay, .cancel-btn').on('click', function() {
      dialogCollection.css('display', 'none');
    });
    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        dialogCollection.css('display', 'none');
      }
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
            thisObj.updateUserList();
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

  updateUserList() {
    var thisObj = this;
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
          res.data.sort(thisObj.sortByCampus);
          wrapFunc.SetUsersDataSource(res.data);
          wrapFunc.PaginateUsersContent(res.data);
        }
      }
    });
  }  

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleOptionDialogClose}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleSearchOptionSubmit}
        disabled={this.state.optionsButton}
      />,
    ];

    return (
      <div>
        <div id="bg-overlay"></div>
        <div id="edit-user-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Edit User</h1>
          </div>
          <div className="dialog-content">
          <div className="block-center">
          <form id="edit-user-form" className="edit-user-content">
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
            </div>
          </form>
          </div>
          </div>
          <div className="dialog-footer">
            <RaisedButton
              id="update-btn"
              label="Update"
              primary={true}
              style={styles.rightAlign}
            />
            <RaisedButton
              className="cancel-btn"
              label="Cancel"
              secondary={true}
              style={styles.rightAlign}
            />
          </div>
        </div>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <h1 style={styles.title}>User Console</h1>
            <div style={styles.balanceStyle}>
              <input
                id="search-box"
                placeholder="Search"
                style={styles.inputStyle}
              />
            </div>
            <Divider/>
              <div style={styles.toolBarItem}>
                <IconButton
                  id="search-option"
                  style={styles.button}
                  iconClassName="fa fa-filter"
                  onTouchTap={this.handleOptionDialogOpen}
                />
                <Dialog
                  title="Search Options"
                  actions={actions}
                  modal={false}
                  open={this.state.optionDialogOpen}
                  onRequestClose={this.handleOptionDialogClose}
                  autoScrollBodyContent={true}
                >
                <div id="options-group" style={styles.optionContentStyle}>
                  <Checkbox
                    label="Student Id"
                    id="sr-id"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Campus"
                    id="sr-campus"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Permission"
                    id="sr-permission"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Name"
                    id="sr-name"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Address"
                    id="sr-location"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Contact No."
                    id="sr-contactNo"
                    style={styles.checkbox}
                  />
                  </div>
                </Dialog>
                <IconButton
                  id="refresh-list"
                  style={styles.button}
                  onTouchTap={this.refreshList}
                  disabled={this.state.refreshBtnDisabled}
                  iconClassName="fa fa-refresh"
                />
                <AddUserDialog/>
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                </DropDownMenu>
                </div>
              </div>
            <Divider/>
            <div style={styles.contentStyle}>
              <div id="errMsg" style={styles.textCenter}></div>
              <div id="pagination-content">
              </div>
              <br/>
              <div id="pagination-container"></div>
            </div>          
          </Card>
        </div>
      </div>
    );
  }
}
