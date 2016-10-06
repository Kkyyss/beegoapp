import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AddRoomTypeDialog from "./RoomTypeComponents/AddRoomTypeDialog.js";

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
  wall: {
    marginLeft: '10px',
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    padding: '10px 0 5px 0',
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
};

var iuRoomTypes = {
    Campus: "IU", 
    TypesOfRooms: [
      'SR(NAC) RM430',
      'SR(AC) RM730',
      'TSR(NAC-1) RM330',
      'TSR(NAC-2) RM410',
      'TSR(AC) RM630',
      'RAB(AC-1) RM1,110',
      'RAB(AC-2) RM790',
      'RAB(AC-3) RM710',
      'RAB(AC-4) RM770',
      'SP(AC-1) RM1,490',
      'SP(AC-2) RM1,380',
    ],
    Total: [
    ],
    NotAvailable: [
    ],
};

export default class RoomTypeConsolePage extends Component {
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
    if ($("#crt-cp").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#crt-tor").is(":checked")) {
      options.push("TypesOfRooms");
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
    
    wrapFunc.SetUpRoomTypeSearchOption(options);
    this.resetButton();
  };

  refreshList = (e) => {
    var thisObj = this;
    thisObj.setState({
      refreshBtnDisabled: true,
    });
    thisObj.updateRoomStatusList();
    $.when().then(function() {
      thisObj.setState({
        refreshBtnDisabled: false,
      });
    });
  }

  resetButton() {
    this.setState({
      optionDialogOpen: false,
      optionsButton: false,
    });
  }

  setSelectedValue(v) {
    var thisObj = this;
    var ds = wrapFunc.GetRoomTypeDataSource();
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
      default: return;
    }

    wrapFunc.SetRoomTypeDataSource(ds);
    wrapFunc.PaginateRoomTypeContent(ds);
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

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      thisObj.updateRoomStatusList();
    });
  }

  updateRoomStatusList() {
    var thisObj = this;
    var userState = {
      userCampus: userData.campus
    };

    ajax({
      url: "/api/view-room-type-list",
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
          wrapFunc.SetRoomTypeDataSource(res.data);
          wrapFunc.PaginateRoomTypeContent(res.data);
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
      <div id="card-wrapper" className="wrapper-margin">
        <Card id="card" style={styles.cardSize}>
           <h1 style={styles.title}>Room Type Console</h1>
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
                    id="crt-cp"
                    style={styles.checkbox}
                  />
                  <Checkbox
                    label="Types Of Rooms"
                    id="crt-tor"
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
                <AddRoomTypeDialog />
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                  <MenuItem value={"Types Of Rooms"} primaryText="Types Of Rooms" />
                  <MenuItem value={"Deposit"} primaryText="Deposit" />
                  <MenuItem value={"Rates"} primaryText="Rates" />
                </DropDownMenu>
                </div>
              </div>
          <Divider/>
          <br/>
          <div style={styles.contentStyle}>
            <div id="errMsg" style={styles.textCenter}></div>
            <div id="pagination-content"></div>
            <br/>
            <div id="pagination-container"></div>
          </div>
        </Card>
      </div>
    );
  }
}
