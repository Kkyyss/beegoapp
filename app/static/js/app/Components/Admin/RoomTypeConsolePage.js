import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import AddRoomTypeDialog from "./RoomTypeComponents/AddRoomTypeDialog.js";

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
  toggle: {
    marginBottom: 16,
  },  
  contentStyle: {
    padding:'25px',
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
  hide: {
    display: 'none',
  },
  rightAlign: {
    float: 'right',      
    margin: 10,
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
    tempOptionIndex = optionsIndex;
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
      case 'Latest':
        ds.sort(thisObj.sortByLatest);
      break;
      case 'Oldest':
        ds.sort(thisObj.sortByOldest);
      break;
      case 'Types Of Rooms':
        ds.sort(thisObj.sortByTypesOfRooms);
      break;
      case 'Lowest Deposit':
        ds.sort(thisObj.sortByLowestDeposit);
      break;
      case 'Lowest Rates':
        ds.sort(thisObj.sortByLowestRates);
      break;
      case 'Highest Deposit':
        ds.sort(thisObj.sortByHighestDeposit);
      break;
      case 'Highest Rates':
        ds.sort(thisObj.sortByHighestRates);
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

  sortByTypesOfRooms(a, b) {
    var av = a.TypesOfRooms.toLowerCase();
    var bv = b.TypesOfRooms.toLowerCase();
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }

  sortByLowestDeposit(a, b) {
    var av = a.Deposit;
    var bv = b.Deposit;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }
  sortByHighestDeposit(a, b) {
    var av = a.Deposit;
    var bv = b.Deposit;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }

  sortByLowestRates(a, b) {
    var av = a.RatesPerPerson;
    var bv = b.RatesPerPerson;
    return ((av < bv) ? -1 : ((av > bv) ? 1 : 0));
  }
  sortByHighestRates(a, b) {
    var av = a.RatesPerPerson;
    var bv = b.RatesPerPerson;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      console.log("Yes");
      if (userData.campus !== 'ALL') {
        var userCampus = userData.campus;
        thisObj.setState({
          value: userCampus,
          disabled: true,
        });
      }
      thisObj.updateRoomStatusList();
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    editRoomTypeResize();

    $(window).on('window:resize', editRoomTypeResize);

    function editRoomTypeResize() {
      var windowHeight = $(window).height();
      var editRoomTypeBox = $('#edit-room-type-box');
      var windowWidth = $(window).width();
      editRoomTypeBox.width(windowWidth * 0.6);
      editRoomTypeBox.height(windowHeight * 0.8);
      var dialogContentHeight = editRoomTypeBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);
    }
    var dialogCollection = $('#bg-overlay, #edit-room-type-box');
    $('#bg-overlay, .cancel-btn').on('click', function() {
      dialogCollection.css('display', 'none');
    });

    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        dialogCollection.css('display', 'none');
      }
    });

    $('#update-btn').on('click', updateRoomType);

    var isValid = false;
    var editRoomTypeForm = $('#edit-rt-form');

    function updateRoomType(e) {
      e.preventDefault();
      thisObj.setState({
        btnDisabled: true,
      });
      var finalValidation = validFunc(vrfEditTor()) &
                            validFunc(dpNumeric());
      if (!finalValidation) {
        console.log(finalValidation);
        return;
      }

      $('#edit-rt-camp').val(thisObj.state.value);
      ajax({
        url: "/user/room-type-console",
        method: "PUT",
        data: editRoomTypeForm.serialize(),
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
            $('#bg-overlay, #edit-room-type-box').css('display', 'none');
            thisObj.updateRoomStatusList();
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

    var eTorMsg = $('#e-torMsg');
    var eTor = $('#edit-tor');
    eTor.on('input focusout', vrfEditTor);
    function vrfEditTor() {
      isValid = wrapFunc.BasicValidation(
        $.trim(eTor.val()),
        eTorMsg,
        "Please don't leave it empty.",
        eTor
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        eTor,
        eTorMsg,
        "Please don't leave it empty."
      );
    }

    var eDpMsg = $('#e-dpMsg');
    var eDp = $('#edit-dp');
    eDp.on('input focusout', dpNumeric);

    function dpNumeric() {
      eDp.val(eDp.val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
      var plainText = eDp.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText.length != 0),
        eDpMsg,
        "Please don't leave it empty.",
        eDp
      );
      if (!isValid) {
        return;
      }
      isValid = wrapFunc.BasicValidation(
        (plainText.match(/^\d+(\.\d+)?$/)),
        eDpMsg,
        "Please key in valid amount.",
        eDp
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        eDp,
        eDpMsg,
        "Please don't leave it empty."
      );
      if (decimalPlaces(plainText) > 2) {
        eDp.val(roundToTwo(eDp.val()));
      }
    }

    var eRppMsg = $('#e-rppMsg');
    var eRpp = $('#edit-rpp');
    eRpp.on('input focusout', rppNumeric);

    function rppNumeric() {
      eRpp.val(eRpp.val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
      var plainText = eRpp.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText.length != 0),
        eRppMsg,
        "Please don't leave it empty.",
        eRpp
      );
      if (!isValid) {
        return;
      }
      isValid = wrapFunc.BasicValidation(
        (plainText.match(/^\d+(\.\d+)?$/)),
        eRppMsg,
        "Please key in valid amount.",
        eRpp
      );
      if (!isValid) {
        return;
      }      
      wrapFunc.MeetRequirement(
        eRpp,
        eRppMsg,
        "Please don't leave it empty."
      );
      if (decimalPlaces(plainText) > 2) {
        eRpp.val(roundToTwo(eRpp.val()));
      }
    }

    function decimalPlaces(num) {
      var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) { return 0; }
      return Math.max(
           0,
           // Number of digits right of decimal point.
           (match[1] ? match[1].length : 0)
           // Adjust for scientific notation.
           - (match[2] ? +match[2] : 0));
    }    

    function roundToTwo(num) {    
        return +(Math.round(num + "e+2")  + "e-2");
    }

    function validFunc(func) {
      func;
      if (isValid) {
        return true;
      }
      return false;
    }    
  }

  updateRoomStatusList() {
    var thisObj = this;
    var userState = {
      userIsAdmin: userData.isAdmin,
      userCampus: userData.campus,
      userGender: userData.gender
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
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetRoomTypeDataSource(res.data);
          wrapFunc.PaginateRoomTypeContent(res.data);
          console.log(optionsIndex);
          console.log(options);
          console.log(tempOptionIndex);
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
        <div id="edit-room-type-box">
          <div className="dialog-header">
          <h1 style={styles.textCenter}>Edit Room Type</h1>
          </div>
          <div className="dialog-content">
          <div className="block-center">
          <form id="edit-rt-form" className="edit-rt-content">
            <input id="edit-id" name="edit-id" type="text" style={styles.hide} />
            <div>Campus&nbsp;
            <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
              <MenuItem value={"IU"} primaryText="IU" />
              <MenuItem value={"IICS"} primaryText="IICS" />
              <MenuItem value={"IICKL"} primaryText="IICKL" />
              <MenuItem value={"IICP"} primaryText="IICP" />
            </DropDownMenu>
            <input id="edit-camp" name="edit-camp" type="text" style={styles.hide} />
            </div>
            <TextField
              id="edit-tor"
              name="edit-tor"
              floatingLabelText="Types Of Rooms"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
            />
            <div id="e-torMsg">Please don't leave it empty.</div>
            <TextField
              id="edit-dp"
              name="edit-dp"
              floatingLabelText="Deposit"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
            />
            <div id="e-dpMsg">Please don't leave it empty.</div>
            <TextField
              id="edit-rpp"
              name="edit-rpp"
              floatingLabelText="Rates Per Person"
              type="text"
              fullWidth={true}
              floatingLabelFixed={true}
            />
           <div id="e-rppMsg">Please don't leave it empty.</div>
           <br/>
            <Toggle
              id="edit-twin"
              name="edit-twin"
              label="Twin"
              defaultToggled={false}
              style={styles.toggle}
            />
            <p className="form-paragraph">Gender</p>
            <RadioButtonGroup name="edit-gdr">
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
                  <MenuItem value={"Latest"} primaryText="Latest" />
                  <MenuItem value={"Oldest"} primaryText="Oldest" />
                  <MenuItem value={"Types Of Rooms"} primaryText="Types Of Rooms" />
                  <MenuItem value={"Lowest Deposit"} primaryText="Lowest Deposit" />
                  <MenuItem value={"Lowest Rates"} primaryText="Lowest Rates" />
                  <MenuItem value={"Highest Deposit"} primaryText="Highest Deposit" />
                  <MenuItem value={"Highest Rates"} primaryText="Highest Rates" />
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
