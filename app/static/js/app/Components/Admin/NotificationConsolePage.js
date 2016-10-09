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
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
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
};

export default class RequestConsolePage extends Component {
  state = {
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

    if ($("#creq-status").is(":checked")) {
      options.push("Status");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    } 

    if ($("#creq-tor").is(":checked")) {
      options.push("TypesOfRooms");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#creq-ss").is(":checked")) {
      options.push("Session");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#creq-si').is(":checked")) {
      options.push("User.StudentId");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#creq-nm').is(':checked')) {
      options.push("User.Name");
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

    wrapFunc.SetUpRequestSearchOption(options);
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
    var ds = wrapFunc.GetRequestDataSource();
    switch (v) {
      case 'Campus':
        ds.sort(thisObj.sortByCampus);
      break;
      case 'Types Of Rooms':
        ds.sort(thisObj.sortByTypesOfRooms);
      break;
      case 'Deposit':
        ds.sort(thisObj.sortByDeposit);
      break;
      case 'Rates':
        ds.sort(thisObj.sortByRates);
      break;
      case 'Payment':
        ds.sort(thisObj.sortByPayment);
      break;
      case 'Status':
        ds.sort(thisObj.sortByPayment);
      break;
      default: return;
    }
    wrapFunc.SetRequestDataSource(ds);
    wrapFunc.PaginateRequestContent(ds);
  }

  sortByCampus(a, b) {
    var av = a.Campus.toLowerCase();
    var bv = b.Campus.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByTypesOfRooms(a, b) {
    var av = a.TypesOfRooms.toLowerCase();
    var bv = b.TypesOfRooms.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByDeposit(a, b) {
    var av = a.Deposit;
    var bv = b.Deposit;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByRates(a, b) {
    var av = a.RatesPerPerson;
    var bv = b.RatesPerPerson;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByPayment(a, b) {
    var av = a.Payment;
    var bv = b.Payment;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByProcessing(a, b) {
    var av = a.Status;
    var bv = b.Status;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      thisObj.updateNotificationList();
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewRequestResize();

    $(window).on('window:resize', viewRequestResize);

    function viewRequestResize() {
      var windowHeight = $(window).height();
      var viewRequestBox = $('#view-nf-box'); 
      var windowWidth = $(window).width();      
      viewRequestBox.width(windowWidth * 0.8);
      viewRequestBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewRequestBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);        
    }
    var dialogCollection = $('#bg-overlay, #view-nf-box');
    $('#bg-overlay, #cancel-btn').on('click', function() {
      dialogCollection.css('display', 'none');
    });

    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        dialogCollection.css('display', 'none');
      }
    });
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
          res.data.sort(thisObj.sortByCampus);
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
        <div id="view-nf-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>View Notification</h1>
          </div>
          <div className="dialog-content">
          <div style={styles.blockContent}>
            <p id="view-nf-dr"></p>
            <p id="view-nf-title"></p>
            <p id="view-nf-message"></p>

            </div>
            </div>
            <div className="dialog-footer">
              <RaisedButton
                id="cancel-btn"
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
                label="Status"
                id="creq-status"
                style={styles.checkbox}
              />                    
              <Checkbox
                label="Types Of Rooms"
                id="creq-tor"
                style={styles.checkbox}
              />
              <Checkbox
                label="Session"
                id="creq-ss"
                style={styles.checkbox}
              />
              <Checkbox
                label="Student Id"
                id="creq-si"
                style={styles.checkbox}
              />
              <Checkbox
                label="Name"
                id="creq-nm"
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
                  <MenuItem value={"Types Of Rooms"} primaryText="Types Of Rooms" />
                  <MenuItem value={"Deposit"} primaryText="Deposit" />
                  <MenuItem value={"Rates"} primaryText="Rates" />
                  <MenuItem value={"Payment"} primaryText="Payment" />
                  <MenuItem value={"Status"} primaryText="Status" />
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
