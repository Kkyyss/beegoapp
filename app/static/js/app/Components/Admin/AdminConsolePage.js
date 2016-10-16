import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import AddAdminDialog from "./AdminComponents/AddAdminDialog.js";
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

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

export default class AdminConsolePage extends Component {

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
    wrapFunc.SetUpAdminSearchOption(options);
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
  };

  setSelectedValue(v) {
    var thisObj = this;
    var ds = wrapFunc.GetAdminDataSource();
    switch (v) {
      case 'Campus':
        ds.sort(thisObj.sortByCampus);
      break;
      case 'Admin ID':
        ds.sort(thisObj.sortByAdminId);
      break;
      case 'Latest':
        ds.sort(thisObj.sortByLatest);
      break;
      case 'Oldest':
        ds.sort(thisObj.sortByOldest);
      break;
      default: return;
    }

    wrapFunc.SetAdminDataSource(ds);
    wrapFunc.PaginateAdminContent(ds);
  }

  sortByCampus(a, b) {
    var aCampus = a.Campus.toLowerCase();
    var bCampus = b.Campus.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
  }

  sortByAdminId(a, b) {
    var aCampus = a.AdminId.toLowerCase();
    var bCampus = b.AdminId.toLowerCase();
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

    var userContactNo = $('#edit-admin-contact-no');
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
      var editUserBox = $('#edit-admin-box');
      var viewUserBox = $('#view-admin-box');
      var windowWidth = $(window).width();
      editUserBox.width(windowWidth * 0.6);
      editUserBox.height(windowHeight * 0.8);
      viewUserBox.width(windowWidth * 0.8);
      viewUserBox.height(windowHeight * 0.8);
      var dialogContentHeight = editUserBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);
    }
    var dialogCollection = $('#bg-overlay, #edit-admin-box, #view-admin-box');
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

      var finalValidation = validFunc(vrfEditAdminName()) &
                            validFunc(vrfEditAdminEmail()) &
                            validFunc(vrfEditAdminId()) &
                            validFunc(vrfEditAdminPhone());

      if (!finalValidation) {
        thisObj.setState({
          btnDisabled: false,
        });        
        return;
      }

      var editUserForm = $('#edit-admin-form');
      $('#edit-admin-campus').val(thisObj.state.value);
      ajax({
        url: "/user/admin-console",
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
            $('#bg-overlay, #edit-admin-box').css('display', 'none');
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

  var editAdminName = $('#edit-admin-name');
  var editAdminNameMsg = $('#e-anMsg');
  editAdminName.on("input focusout",vrfEditAdminName);
  function vrfEditAdminName() {

    isValid = wrapFunc.BasicValidation(
      $.trim(editAdminName.val()),
      editAdminNameMsg,
      "Please don't leave it empty.",
      editAdminName
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      editAdminName,
      editAdminNameMsg,
      "Please don't leave it empty."
    );
  }

  var editAdminId = $('#edit-admin-uid');
  var editAdminIdMsg = $('#e-aiMsg');
  editAdminId.on("input focusout", vrfEditAdminId);
  function vrfEditAdminId() {
    isValid = wrapFunc.BasicValidation(
      $.trim(editAdminId.val()),
      editAdminIdMsg,
      "Please don't leave it empty.",
      editAdminId
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      editAdminId,
      editAdminIdMsg,
      "Please don't leave it empty."
    );
  }  

  var editAdminEmail = $('#edit-admin-email');
  var editAdminEmailMsg = $('#e-aeMsg');
  editAdminEmail.on("input focusout", vrfEditAdminEmail);
  function vrfEditAdminEmail() {
    var plainText = editAdminEmail.val().trim();
    isValid = wrapFunc.BasicValidation(
      plainText.length != 0,
      editAdminEmailMsg,
      "Please don't leave it empty.",
      editAdminEmail
    );
    if (!isValid) {
      return;
    }
    isValid = wrapFunc.BasicValidation(
      plainText.match(/^.+@.+$/),
      editAdminEmailMsg,
      "Please enter valid student email format.",
      editAdminEmail
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      editAdminEmail,
      editAdminEmailMsg,
      "Please don't leave it empty."
    );
  }

  var editAdminPhone = $('#edit-admin-contact-no');
  var editAdminPhoneMsg = $('#e-apMsg');
  editAdminPhone.on("input focusout", vrfEditAdminPhone);
  function vrfEditAdminPhone() {
    editAdminPhone.val(editAdminPhone.intlTelInput("getNumber"));
    if ($.trim(editAdminPhone.val())) {
      isValid = wrapFunc.BasicValidation(
        editAdminPhone.intlTelInput("isValidNumber"),
        editAdminPhoneMsg,
        "Please enter valid phone number.",
        editAdminPhone
      );
      if (!isValid) {
        return;
      }
    } else {
      isValid = true;
    }

    wrapFunc.MeetRequirement(
      editAdminPhone,
      editAdminPhoneMsg,
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
    // var userState = {
    //   userCampus: userData.campus
    // };
    ajax({
      url: "/api/view-admin-list",
      method: "POST",
      cache: false,
      // data: JSON.stringify(userState),
      beforeSend: function() {
        wrapFunc.LoadingSwitch(true);
      },
      success: function(res) {
        wrapFunc.LoadingSwitch(false);
        if (res.error != null) {
          $('#errMsg').text(res.error);
        } else {
          console.log(res.data);
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetAdminDataSource(res.data);
          wrapFunc.PaginateAdminContent(res.data);
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
        <div id="edit-admin-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Edit Admin</h1>
          </div>
          <div className="dialog-content">
          <div className="block-center">
          <form id="edit-admin-form" className="edit-admin-content">
            <input id="edit-admin-id" name="edit-admin-id" type="text" style={styles.hide} />
            <div>Campus&nbsp;
            <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
              <MenuItem value={"ALL"} primaryText="ALL" />
              <MenuItem value={"IU"} primaryText="IU" />
              <MenuItem value={"IICS"} primaryText="IICS" />
              <MenuItem value={"IICKL"} primaryText="IICKL" />
              <MenuItem value={"IICP"} primaryText="IICP" />
            </DropDownMenu>
            <input id="edit-admin-campus" name="edit-admin-campus" type="text" style={styles.hide} />
            <TextField
              id="edit-admin-name"
              name="edit-admin-name"
              floatingLabelText="Full Name"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
            />
            <div id="e-anMsg">Please don't leave it empty.</div>
            <TextField
              id="edit-admin-email"
              name="edit-admin-email"
              floatingLabelText="Email"
              type="email"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
            />
            <div id="e-aeMsg">Please don't leave it empty.</div>
            <TextField
              id="edit-admin-uid"
              name="edit-admin-uid"
              floatingLabelText="Admin ID"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
            />
            <div id="e-aiMsg">Please don't leave it empty.</div>
            <br/>
            <p className="form-paragraph">Contact No.</p>
            <input
              id="edit-admin-contact-no"
              name="edit-admin-contact-no"
              type="tel"
            />
            <div id="e-apMsg"></div>
            <br/>
            <p className="form-paragraph">Role & Permissions</p>
            <Toggle
              id="edit-admin-activated"
              name="edit-admin-activated"
              label="Activated"
              defaultToggled={true}
              style={styles.toggle}
            />
            <Toggle
              id="edit-admin-permission"
              name="edit-admin-permission"
              label="Full Permission"
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
        <div id="view-admin-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Profile</h1>
          </div>
          <div className="dialog-content">
            <div className="table-hero">
              <Card className="half-content">
                <table className="centerTable">
                  <caption>
                    <Avatar
                      id="view-admin-avatar"
                      src="../"
                      size={128} />
                  </caption>
                  <tbody>
                  </tbody>
                </table>
              </Card>
              <Card className="half-content">
                <table className="centerTable">
                  <caption><h1>Role & Permissions</h1></caption>
                  <tbody>
                    <tr>
                      <td>Activated</td>
                      <td><b><span id="view-admin-activated"></span></b></td>
                    </tr>
                    <tr>
                      <td>Permission</td>
                      <td><b><span id="view-admin-pm"></span></b></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
            <div style={styles.clearFix}></div>
            <div className="table-hero">
              <Card className="two-wrapper">
                <table className="centerTable">
                  <caption><h1>Basic Information</h1></caption>
                  <tbody>
                    <tr style={styles.bottomLine}>
                      <td>Campus</td>
                      <td style={styles.textLeft}><b><span id="view-admin-campus"></span></b></td>
                    </tr>
                    <tr style={styles.bottomLine}>
                      <td>Full Name</td>
                      <td style={styles.textLeft}><b><span id="view-admin-name"></span></b></td>
                    </tr>
                    <tr style={styles.bottomLine}>
                      <td>Email</td>
                      <td style={styles.textLeft}><b><span id="view-admin-email"></span></b></td>
                    </tr>
                    <tr>
                      <td>Contact No.</td>
                      <td style={styles.textLeft}><b><span id="view-admin-contact-no"></span></b></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
          <div className="dialog-footer">
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
            <h1 style={styles.title}>Admin Console</h1>
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
                <AddAdminDialog/>
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                  <MenuItem value={"Admin ID"} primaryText="Admin ID" />
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
