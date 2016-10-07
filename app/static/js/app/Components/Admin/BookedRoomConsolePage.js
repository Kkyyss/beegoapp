import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

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
  textCenter: {
    textAlign: 'center',
  },
  balanceStyle: {
    display: 'flex',
    marginBottom: 15,
  },
  inputStyle: {
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
  bgColor: {
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    margin: 0,
  },
  textLeft: {
    textAlign: 'left',
  },
};

export default class BookedRoomConsolePage extends Component {
  state = {
    refreshBtnDisabled: false,
    optionDialogOpen: false,
    optionsButton: false,
    sortValue: "Campus",
  };

  handleSortTypeChange = (event, index, value) => {
    this.setSelectedValue();
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

    if ($("#cb-no").is(":checked")) {
      options.push("Room.RoomNo");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    } 

    if ($("#cb-tor").is(":checked")) {
      options.push("Room.TypesOfRooms");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#cb-cp").is(":checked")) {
      options.push("Room.Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#cb-si').is(":checked")) {
      options.push("StudentId");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($('#cb-nm').is(':checked')) {
      options.push("Name");
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

    wrapFunc.SetUpBookedSearchOption(options);
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
    thisObj.updateBookedList();
    $.when().then(function() {
      thisObj.setState({
        refreshBtnDisabled: false,
      });
    });
  };

  setSelectedValue(v) {
    var thisObj = this;
    var ds = wrapFunc.GetRoomDataSource();
    switch (v) {
      case 'Campus':
        ds.sort(thisObj.sortByCampus);
      break;
      case 'RoomNo':
        ds.sort(thisObj.sortByRoomNo);
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
      case 'Student ID':
        ds.sort(thisObj.sortByStudentId);
      break;
      case 'Student Name':
        ds.sort(thisObj.sortByName);
      break;      
      default: return;
    }
    wrapFunc.SetBookedDataSource(ds);
    wrapFunc.PaginateBookedContent(ds);
  }

  sortByCampus(a, b) {
    var av = a.Room.Campus.toLowerCase();
    var bv = b.Room.Campus.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByRoomNo(a, b) {
    var av = a.Room.RoomNo.toLowerCase();
    var bv = b.Room.RoomNo.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByTypesOfRooms(a, b) {
    var av = a.Room.TypesOfRooms.toLowerCase();
    var bv = b.Room.TypesOfRooms.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByDeposit(a, b) {
    var av = a.Room.Deposit;
    var bv = b.Room.Deposit;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByRates(a, b) {
    var av = a.Room.RatesPerPerson;
    var bv = b.Room.RatesPerPerson;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByStudentId(a, b) {
    var av = a.StudentId;
    var bv = b.StudentId;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByName(a, b) {
    var av = a.Name;
    var bv = b.Name;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      thisObj.updateBookedList();
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewBookedResize();

    $(window).on('window:resize', viewBookedResize);    

    function viewBookedResize() {
      var windowHeight = $(window).height();
      var viewBookedBox = $('#view-booked-box');
      var windowWidth = $(window).width();
      viewBookedBox.width(windowWidth * 0.8);
      viewBookedBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewBookedBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);      
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      $('#bg-overlay, #view-booked-box').css('display', 'none');
    });

    
  }

  updateBookedList() {
    var thisObj = this;
    var userState = {
      userCampus: userData.campus
    };

    ajax({
      url: "/api/view-booked-list",
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
          wrapFunc.SetBookedDataSource(res.data);
          wrapFunc.PaginateBookedContent(res.data);
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
        <div id="view-booked-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>View Booked</h1>
          </div>
          <div className="dialog-content">
              <div className="table-hero">
                <Card className="half-wrapper">
                <table className="centerTable">
                  <caption><h1>User Details</h1></caption>
                  <tbody>
                    <tr>
                      <td style={styles.textCenter}>Full Name</td>
                      <td style={styles.textLeft}>
                        <b><span id="view-booked-name"></span></b>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.textCenter}>Student Id</td>
                      <td style={styles.textLeft}>
                        <b><span id="view-booked-si"></span></b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </Card>
                <Card className="half-wrapper">
                <table className="centerTable">
                  <caption><h1>Room Details</h1></caption>
                  <tbody>
                    <tr>
                      <td style={styles.textCenter}>Campus</td>
                      <td style={styles.textLeft}>
                        <b><span id="view-booked-cp"></span></b>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.textCenter}>Room No.</td>
                      <td style={styles.textLeft}>
                        <b><span id="view-booked-rn"></span></b>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.textCenter}>Types</td>
                      <td style={styles.textLeft}>
                        <b><span id="view-booked-tor"></span></b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </Card>
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
        </div>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
          <h1 style={styles.title}>Booked Room Console</h1>
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
                label="Room Number"
                id="cb-no"
                style={styles.checkbox}
              />
              <Checkbox
                label="Types Of Rooms"
                id="cb-tor"
                style={styles.checkbox}
              />
              <Checkbox
                label="Campus"
                id="cb-cp"
                style={styles.checkbox}
              />
              <Checkbox
                label="Student Id"
                id="cb-si"
                style={styles.checkbox}
              />
              <Checkbox
                label="Name"
                id="cb-nm"
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
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                  <MenuItem value={"RoomNo"} primaryText="RoomNo" />
                  <MenuItem value={"Types Of Rooms"} primaryText="Types Of Rooms" />
                  <MenuItem value={"Deposit"} primaryText="Deposit" />
                  <MenuItem value={"Rates"} primaryText="Rates" />
                  <MenuItem value={"Student ID"} primaryText="Student ID" />
                  <MenuItem value={"Student Name"} primaryText="Student Name" />
                </DropDownMenu>
                </div>
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
