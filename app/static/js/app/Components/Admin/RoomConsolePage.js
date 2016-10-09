import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import AddRoomDialog from "./RoomComponents/AddRoomDialog.js";

require('../CSS/pagination.css');

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;
var items = [];
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
  hide: {
    display: 'none',
  },
  toggle: {
    marginBottom: 16,
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
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
  },
  clear: {
    both: 'clear',
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
  textRight: {
    textAlign: 'right',
  },
};

const iuRoomTypes = [
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
];

export default class AdminConsolePage extends Component {
  state = {
    value: "IU",
    disabled: false,
    editUpdate: false,
    refreshBtnDisabled: false,
    optionDialogOpen: false,
    optionsButton: false,
    sortValue: "Campus",
    roomTypeValue: "",
    roomTypeDisabled: false,
  };

  handleCampusChange = (event, index, value) => {
    items = [];
    this.changeResource(value);
  };

  handleRoomTypeChange = (event, index, value) => {
    this.setState({
      roomTypeValue: value,
    });
  };

  changeResource(value) {
    this.getRoomByCampusOnChange(value);
    if (this.state.disabled) {
      return;
    }
    this.setState({
      campusValue: value,
    });
  } 

  getRoomByCampusOnChange(value) {
    var campusState = {
      userIsAdmin: userData.isAdmin,      
      userCampus: value,
      userGender: userData.gender      
    };

    this.onAjaxRequest(campusState);
  }

  getRoomTypeList() {
    var userState = {
      userIsAdmin: userData.isAdmin,
      userCampus: userData.campus,
      userGender: userData.gender
    };

    this.onAjaxRequest(userState);
  }

  onAjaxRequest(us) {
    var thisObj = this;
    ajax({
      url: "/api/view-room-type-list",
      method: "POST",
      cache: false,
      data: JSON.stringify(us),
      beforeSend: function() {
        wrapFunc.LoadingSwitch(true);
      },
      success: function(res) {
        wrapFunc.LoadingSwitch(false);
        if (res.error != null) {
          wrapFunc.AlertStatus(
            "Oops...",
            res.error,
            "error",
            false,
            false
          );
          thisObj.setState({
            roomTypeDisabled: true,
          });
        } else {
          console.log(res.data);
          thisObj.generateCampusItem(res.data);
          thisObj.setState({
            roomTypeDisabled: false,
          });
        }
      }
    });
  }

  generateCampusItem(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++ ) {
      items.push(<MenuItem value={data[i].TypesOfRooms} key={data[i].TypesOfRooms} primaryText={data[i].TypesOfRooms} />);
    }
    this.setState({
      roomTypeValue: data[0].TypesOfRooms,
    });
  }   

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

    if ($("#cr-no").is(":checked")) {
      options.push("RoomNo");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    } 

    if ($("#cr-cp").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    if ($("#cr-tor").is(":checked")) {
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

    wrapFunc.SetUpRoomSearchOption(options);
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
    thisObj.updateRoomList();
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
      case 'Types Of Rooms':
        ds.sort(thisObj.sortByTypesOfRooms);
      break;
      case 'Deposit':
        ds.sort(thisObj.sortByDeposit);
      break;
      case 'Rates':
        ds.sort(thisObj.sortByRates);
      break;
      case 'Available':
        ds.sort(thisObj.sortByAvailable);
      break;
      default: return;
    }
    wrapFunc.SetRoomDataSource(ds);
    wrapFunc.PaginateRoomContent(ds);
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

  sortByAvailable(a, b) {
    var av = a.IsAvailable;
    var bv = b.IsAvailable;
    return ((av && !bv) ? -1 : ((!av && bv) ? 1 : 0));
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
      thisObj.updateRoomList();
      $.when().then(function() {
        thisObj.getRoomTypeList();
      });
    }); 

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    editRoomResize();

    $(window).on('window:resize', editRoomResize);

    function editRoomResize() {
      var windowHeight = $(window).height();
      var editRoomBox = $('#edit-room-box');
      var windowWidth = $(window).width();
      editRoomBox.width(windowWidth * 0.8);
      editRoomBox.height(windowHeight * 0.8);
      console.log(editRoomBox.height());
      var dialogContentHeight = editRoomBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      clearEditForm();
      $('#bg-overlay, #edit-room-box').css('display', 'none');
    });

    $('#update-btn').on('click', updateRoom);

    function updateRoom(e) {
      e.preventDefault();
      thisObj.setState({
        editUpdate: true,
      });
      var editRoomForm = $('#edit-room-form');
      var editCampus = $('#edit-campus');
      editCampus.val(thisObj.state.value);
      $('#edit-types-of-rooms').val(thisObj.state.roomTypeValue);
      ajax({
        url: "/user/room-console",
        method: "PUT",
        data: editRoomForm.serialize(),
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
            $('#bg-overlay, #edit-room-box').css('display', 'none');
            clearEditForm();
            thisObj.updateRoomList();
            wrapFunc.AlertStatus(
              "Success",
              "Update successfully!",
              "success",
              true,
              true
            );
          }
          thisObj.setState({
            editUpdate: false,
          });
        }
      });
    }

    function clearEditForm() {
      console.log(items);
      if (!$('#edit-available').is(":checked")) {
        $('#edit-available').click();
      }
      $('#edit-room-no').val('');
    }
  }

  updateRoomList() {
    var thisObj = this;
    console.log(userData.campus);
    var userState = {
      userCampus: userData.campus,
    };        
    ajax({
      url: "/api/view-room-list",
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
          wrapFunc.SetRoomDataSource(res.data);
          wrapFunc.PaginateRoomContent(res.data);
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
        <div id="edit-room-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Edit Room</h1>
          </div>      
          <div className="dialog-content">
            <div className="table-hero">
              <div className="current-wrapper">
                <table className="tableBody">
                  <tbody>
                    <tr>
                      <td>Campus</td>
                      <td style={styles.textRight}><span id="current-campus"></span></td>
                    </tr>
                    <tr>
                      <td>Types</td>
                      <td style={styles.textRight}><span id="current-tor"></span></td>
                    </tr>
                    <tr>
                      <td>Number</td>
                      <td style={styles.textRight}><span id="current-no"></span></td>
                    </tr>
                    <tr>
                      <td>Available</td>
                      <td style={styles.textRight}><span id="current-av"></span></td>
                    </tr>                                        
                  </tbody>
                </table>
              </div>
              <div className="edit-form-wrapper">
                <form id="edit-room-form">
                  <div>
                    <input id="edit-room-id" name="edit-room-id" style={styles.hide} />
                    Campus&nbsp;
                    <DropDownMenu id="edit-campusDropDown" name="edit-campusDropDown" value={this.state.value} onChange={this.handleCampusChange} disabled={this.state.disabled}>
                      <MenuItem value={"IU"} primaryText="IU" />
                      <MenuItem value={"IICS"} primaryText="IICS" />
                      <MenuItem value={"IICKL"} primaryText="IICKL" />
                      <MenuItem value={"IICP"} primaryText="IICP" />
                    </DropDownMenu>
                    <input id="edit-campus" name="edit-campus" type="text" style={styles.hide} />
                    <br/><br/>
                    Types&nbsp;
                    <DropDownMenu maxHeight={250} id="editRoomTypesDropDown" value={this.state.roomTypeValue} onChange={this.handleRoomTypeChange} disabled={this.state.roomTypeDisabled}>
                      {items}
                    </DropDownMenu>
                    <input id="edit-types-of-rooms" name="edit-types-of-rooms" type="text" style={styles.hide} />
                    <br/>
                    <TextField
                      id="edit-room-no"
                      name="edit-room-no"
                      floatingLabelText="Room No."
                      type="text"
                      fullWidth={true}
                      floatingLabelFixed={true}
                      underlineStyle={styles.underlineStyle}
                      underlineFocusStyle={styles.underlineFocusStyle} 
                      floatingLabelStyle={styles.floatingLabelStyle}
                    />
                    <br/><br/>
                    <Toggle
                      id="edit-available"
                      name="edit-available"
                      label="Available"
                      defaultToggled={true}
                      style={styles.toggle}
                    />              
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="dialog-footer">
              <RaisedButton 
                id="update-btn"
                label="Update"
                primary={true}
                style={styles.rightAlign}
                disabled={this.state.editUpdate}
              />
              <RaisedButton
                id="cancel-btn"
                label="Cancel"
                secondary={true}
                style={styles.rightAlign}
              />
          </div>
          <div style={styles.clear}></div>
        </div>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
           <h1 style={styles.title}>Room Console</h1>
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
                id="cr-no"
                style={styles.checkbox}
              />                    
              <Checkbox
                label="Campus"
                id="cr-cp"
                style={styles.checkbox}
              />
              <Checkbox
                label="Types Of Rooms"
                id="cr-tor"
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
          <AddRoomDialog/>
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
                  <MenuItem value={"Types Of Rooms"} primaryText="Types Of Rooms" />
                  <MenuItem value={"Deposit"} primaryText="Deposit" />
                  <MenuItem value={"Rates"} primaryText="Rates" />
                  <MenuItem value={"Available"} primaryText="Available" />
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
      </div>
    );
  }
}
