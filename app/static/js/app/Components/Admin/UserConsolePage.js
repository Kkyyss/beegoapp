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

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var intlTelInput = window.IntlTelInput;
var userData;
var tempOptionIndex = [1];
var options = [];
var optionsIndex = [1];

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
    this.setState({
      value: value,
    });
  };

  handleSortTypeChange = (event, index, value) => {
    this.setSelectedValue(value);
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
    optionsIndex = tempOptionIndex;
    this.setState({
      optionDialogOpen: false,
    });
  };

  handleSearchOptionSubmit = (e) => {
    this.setState({
      optionsButton: true,
    });
    tempOptionIndex = optionsIndex;
    options = [];
    optionsIndex = [];
    if ($("#s-id").is(":checked")) {
      options.push("StudentId");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#s-campus").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#s-name').is(':checked')) {
      options.push("Name");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#s-contactNo').is(':checked')) {
      options.push("ContactNo");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if (optionsIndex.indexOf(1) < 0) {
      wrapFunc.AlertStatus(
        "Oopps...",
        "Please select at least 1 option.",
        "error",
        false,
        false
      );
      this.setState({
        optionsButton: false,
      });
      return;
    }

    tempOptionIndex = optionsIndex;
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

  setSelectedValue(v) {
    var thisObj = this;
    var ds = wrapFunc.GetUsersDataSource();
    switch (v) {
      case 'Campus':
        ds.sort(thisObj.sortByCampus);
      break;
      case 'Student ID':
        ds.sort(thisObj.sortByStudentId);
      break;      
      case 'Latest':
        ds.sort(thisObj.sortByLatest);
      break;
      case 'Oldest':
        ds.sort(thisObj.sortByOldest);
      break;
      default: return;
    }

    wrapFunc.SetUsersDataSource(ds);
    wrapFunc.PaginateUsersContent(ds);
  }

  sortByCampus(a, b) {
    var aCampus = a.Campus.toLowerCase();
    var bCampus = b.Campus.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
  }

  sortByStudentId(a, b) {
    var aCampus = a.StudentId.toLowerCase();
    var bCampus = b.StudentId.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
  }  

  sortByLatest(a, b) {
    var av = a.TimeStamp;
    var bv = b.TimeStamp;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }

  sortByOldest(a, b) {
    var av = a.TimeStamp;
    var bv = b.TimeStamp;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
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
        $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
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
    var isValid = false;
    function updateUser(e) {
      e.preventDefault();
      thisObj.setState({
        btnDisabled: true,
      });

      var finalValidation = validFunc(vrfEditUserName()) &
                            validFunc(vrfEditUserEmail()) &
                            validFunc(vrfEditUserPhone());

      if (!finalValidation) {
        thisObj.setState({
          btnDisabled: false,
        });        
        return;
      }

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

  var editUserName = $('#edit-user-name');
  var editUserMsg = $('#e-unMsg');
  editUserName.on("input focusout", vrfEditUserName);
  function vrfEditUserName() {
    isValid = wrapFunc.BasicValidation(
      $.trim(editUserName.val()),
      editUserMsg,
      "Please don't leave it empty.",
      editUserName
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      editUserName,
      editUserMsg,
      "Please don't leave it empty."
    );
  }

    var editUserEmail = $('#edit-user-email');
    var editEmailMsg = $('#e-ueMsg');
    editUserEmail.on("input focusout", vrfEditUserEmail);
  function vrfEditUserEmail() {
    var plainText = editUserEmail.val().trim();
    isValid = wrapFunc.BasicValidation(
      plainText.length != 0,
      editEmailMsg,
      "Please don't leave it empty.",
      editUserEmail
    );
    if (!isValid) {
      return;
    }
    isValid = wrapFunc.BasicValidation(
      plainText.match(/^(i|j|p|l){1}[0-9]{5,}@student.newinti.edu.my$/),
      editEmailMsg,
      "Please enter valid student email format.",
      editUserEmail
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      editUserEmail,
      editEmailMsg,
      "Please don't leave it empty."
    );
  }

  var editUserPhone = $('#edit-user-contact-no');
  var editPhoneMsg = $('#e-upMsg');
  editUserPhone.on("input focusout", vrfEditUserPhone);
  function vrfEditUserPhone() {
      editUserPhone.val(editUserPhone.intlTelInput("getNumber"));
      if ($.trim(editUserPhone.val())) {
        isValid = wrapFunc.BasicValidation(
          editUserPhone.intlTelInput("isValidNumber"),
          editPhoneMsg,
          "Please enter valid phone number.",
          editUserPhone
        );
        if (!isValid) {
          return;
        }
      } else {
        isValid = true;
      }

      wrapFunc.MeetRequirement(
        editUserPhone,
        editPhoneMsg,
        ""
      );
    }  

    function validFunc(func) {
      func;
      if (isValid) {
        return true;
      }
      return false;
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
          res.data.sort(thisObj.sortByLatest);
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
            <div id="e-unMsg">Please don't leave it empty.</div>
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
            <div id="e-ueMsg">Please don't leave it empty.</div>
            <br/>
            <p className="form-paragraph">Gender</p>
            <RadioButtonGroup name="edit-user-gender">
              <RadioButton
                value="male"
                label="Male"
              />
              <RadioButton
                value="female"
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
            <div id="e-upMsg"></div>
            <br/>
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
              disabled={this.state.btnDisabled}
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
            <h1 style={styles.title}>Student Console</h1>
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
                    id="s-id"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Campus"
                    id="s-campus"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Name"
                    id="s-name"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Contact No."
                    id="s-contactNo"
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
                  <MenuItem value={"Student ID"} primaryText="Student ID" />
                  <MenuItem value={"Latest"} primaryText="Latest" />
                  <MenuItem value={"Oldest"} primaryText="Oldest" />
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
