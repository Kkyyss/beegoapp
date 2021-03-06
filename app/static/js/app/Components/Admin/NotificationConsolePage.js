import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AddNotificationDialog from "./NotificationComponents/AddNotificationDialog.js";

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
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
  contentStyle: {
    padding:'25px',
  },
  toolBar: {
    backgroundColor: '#E1BEE7',
    paddingLeft: '10px',
    display: 'flex',
    flexWrap: 'wrap',
  },  
  textCenter: {
    textAlign: 'center',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  viewContentStyle: {
    padding: '0 15% 0 15%',
  },
  bgColor: {
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    margin: 0,
  },
  blockContent: {
    display: 'flex',
    flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: '0 15px 0 15px',
  },
  clearFix: {
    both: 'clear',
  },
  cancelBtnStyle: {
    width: '100%',
    fontSize: 18,
    padding: 10,
    backgroundColor: '#FF1744',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
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
  toolBarItem: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '0 15px 0 15px',
  },
  optionContentStyle: {
    padding: 20,
  },
  checkbox: {
    marginBottom: 16,
  },
  button: {
    margin: '0 5px 0 5px',
  },
  title: {
    textAlign: 'center',
    padding: '10px 0 5px 0',
  },  
  wall: {
    marginLeft: '10px',
  },
  rightAlign: {
    float: 'right',      
    margin: 10,
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
  hide: {
    display: 'none',
  },
};

export default class NotificationConsolePage extends Component {
  state = {
    value: "IU",
    disabled: false,    
    btnDisabled: false,    
    refreshBtnDisabled: false,
    optionDialogOpen: false,
    optionsButton: false,
    sortValue: "Campus",
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

    if ($("#unf-cp").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    } 

    if ($("#unf-title").is(":checked")) {
      options.push("Title");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#unf-msg").is(":checked")) {
      options.push("Message");
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
    wrapFunc.SetUpNotificationSearchOption(options);
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
    thisObj.updateNotificationList();
    $.when().then(function() {
      thisObj.setState({
        refreshBtnDisabled: false,
      });
    });
  };

  setSelectedValue(v) {
    var thisObj = this;
    var ds = wrapFunc.GetNotificationDataSource();
    switch (v) {
      case 'Campus':
        ds.sort(thisObj.sortByCampus);
      break;
      case 'Title':
        ds.sort(thisObj.sortByTitle);
      break;
      case 'Latest':
        ds.sort(thisObj.sortByLatest);
      break;
      case 'Oldest':
        ds.sort(thisObj.sortByOldest);
      break;
      default: return;
    }
    wrapFunc.SetNotificationDataSource(ds);
    wrapFunc.PaginateNotificationContent(ds);
  }

  sortByCampus(a, b) {
    var av = a.Campus.toLowerCase();
    var bv = b.Campus.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByTitle(a, b) {
    var av = a.Title.toLowerCase();
    var bv = b.Title.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByLatest(a, b) {
    var av = a.DateReceive;
    var bv = b.DateReceive;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }

  sortByOldest(a, b) {
    var av = a.DateReceive;
    var bv = b.DateReceive;
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
      thisObj.updateNotificationList();
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewNfResize();

    $(window).on('window:resize', viewNfResize);

    function viewNfResize() {
      var windowHeight = $(window).height();
      var viewNftBox = $('#edit-nf-box'); 
      var windowWidth = $(window).width();      
      viewNftBox.width(windowWidth * 0.8);
      viewNftBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewNftBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);        
    }
    var dialogCollection = $('#bg-overlay, #edit-nf-box');
    $('#bg-overlay, .cancel-btn').on('click', function() {
      dialogCollection.css('display', 'none');
    });

    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        dialogCollection.css('display', 'none');
      }
    });

    $('#update-btn').on('click', updateNf);
    var isValid = false;
    function updateNf(e) {
      e.preventDefault();
      thisObj.setState({
        btnDisabled: true,
      });

      var finalValidation = validFunc(vrfTitle()) &
                            validFunc(vrfMessage());
      if (!finalValidation) {
        thisObj.setState({
          btnDisabled: false,
        });
        return;
      }
      var editNfForm = $('#edit-nf-form');
      $('#edit-nf-campus').val(thisObj.state.value);
      $('#edit-nf-message').val();
      ajax({
        url: "/user/notification-console",
        method: "PUT",
        data: editNfForm.serialize(),
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
            $('#bg-overlay, #edit-nf-box').css('display', 'none');
            thisObj.updateNotificationList();
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

    var eNfTitleMsg = $('#e-nfTitleMsg');
    var eNfTitle = $('#edit-nf-title');
    eNfTitle.on("input focusout", vrfTitle);
    function vrfTitle() {
      isValid = wrapFunc.BasicValidation(
        $.trim(eNfTitle.val()),
        eNfTitleMsg,
        "Please don't leave it empty.",
        eNfTitle
      );
      console.log(isValid);
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        eNfTitle,
        eNfTitleMsg,
        "Please don't leave it empty."
      );
    }

    var eNfmsgMsg = $('#e-nfmsgMsg');
    var eNfMessage = $('#edit-nf-message');
    eNfMessage.on("input focusout", vrfMessage);
    function vrfMessage() {
      isValid = wrapFunc.BasicValidation(
        $.trim(eNfMessage.val()),
        eNfmsgMsg,
        "Please don't leave it empty.",
        eNfMessage
      );
      console.log(isValid);
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        eNfMessage,
        eNfmsgMsg,
        "Please don't leave it empty."
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

  updateNotificationList() {
    var thisObj = this;
    var userState = {
      userCampus: userData.campus
    };

    ajax({
      url: "/api/view-notification-list",
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
          console.log(res.data);
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetNotificationDataSource(res.data);
          wrapFunc.PaginateNotificationContent(res.data);
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
        <div id="edit-nf-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Edit Notification</h1>
          </div>
          <div className="dialog-content">
            <div className="block-center">
              <form id="edit-nf-form" className="edit-nf-content">
                <input id="edit-nf-id" name="edit-nf-id" type="text" style={styles.hide} />
                <div>Campus&nbsp;
                <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                  <MenuItem value={"ALL"} primaryText="ALL" />
                  <MenuItem value={"IU"} primaryText="IU" />
                  <MenuItem value={"IICS"} primaryText="IICS" />
                  <MenuItem value={"IICKL"} primaryText="IICKL" />
                  <MenuItem value={"IICP"} primaryText="IICP" />
                </DropDownMenu>
                <input id="edit-nf-campus" name="edit-nf-campus" type="text" style={styles.hide} />
                </div>
                <TextField 
                  id="edit-nf-dr"
                  name="edit-nf-dr"
                  floatingLabelText="Date"
                  type="text"
                  fullWidth={true}
                  floatingLabelFixed={true}
                  readOnly={true}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="edit-nf-title"
                  name="edit-nf-title"
                  floatingLabelText="Title"
                  type="text"
                  fullWidth={true}
                  floatingLabelFixed={true}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <div id="e-nfTitleMsg">Please don't leave it empty.</div>
                <TextField
                  id="edit-nf-message"
                  name="edit-nf-message"
                  floatingLabelText="Message"
                  type="text"
                  fullWidth={true}
                  floatingLabelFixed={true}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelStyle={styles.floatingLabelStyle}
                  multiLine={true}
                  rowsMax={4}
                  rows={2}
                />
                <div id="e-nfmsgMsg">Please don't leave it empty.</div>
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
              <div style={styles.clearFix}></div>
            </div>
          <br/>
        </div>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
          <h1 style={styles.title}>Notification Console</h1>
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
              tooltip="Filter"
              touch={true}
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
                label="Campus"
                id="unf-cp"
                style={styles.checkbox}
              />
              <Checkbox
                label="Title"
                id="unf-title"
                style={styles.checkbox}
              />
              <Checkbox
                label="Message"
                id="unf-msg"
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
                  tooltip="Refresh"
                  touch={true}
                />
                <AddNotificationDialog />
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                  <MenuItem value={"Title"} primaryText="Title" />
                  <MenuItem value={"Latest"} primaryText="Latest" />
                  <MenuItem value={"Oldest"} primaryText="Oldest" />
                </DropDownMenu>
                </div>                 
            </div>
            <Divider />
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
