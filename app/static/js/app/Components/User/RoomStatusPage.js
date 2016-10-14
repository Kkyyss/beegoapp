import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

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
  },
  blockCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: '0 15px 0 15px',
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

var campusDataSource;

export default class RoomStatusPage extends Component {
  state = {
    refreshBtnDisabled: false,
    optionDialogOpen: false,
    optionsButton: false,
    sortValue: "Available",
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

    if ($("#rs-cp").is(":checked")) {
      options.push("Campus");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    } 

    if ($("#rs-tor").is(":checked")) {
      options.push("TypesOfRooms");
      optionsIndex.push(1);
    } else {
      optionsIndex.push(0);
    }

    wrapFunc.SetUpRoomStatusSearchOption(options);
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
    thisObj.updateRoomStatusList();
    $.when().then(function() {
      thisObj.setState({
        refreshBtnDisabled: false,
      });
    });
  };

  sortByCampus(a, b) {
    var aCampus = a.Campus.toLowerCase();
    var bCampus = b.Campus.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
  }  


  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      thisObj.updateRoomStatusList();
    });
  }

  updateRoomStatusList() {
    var userState = {
      userIsAdmin: userData.isAdmin,
      userCampus: userData.campus,
      userGender: userData.gender
    };
    ajax({
      url: "/api/view-room-status-list",
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
          wrapFunc.SetRoomStatusDataSource(res.data);
          wrapFunc.PaginateRoomStatusContent(res.data);
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
          <h1 style={styles.title}>Room Status Console</h1>
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
                id="rs-cp"
                style={styles.checkbox}
              />                    
              <Checkbox
                label="Types Of Rooms"
                id="rs-tor"
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
                  <MenuItem value={"Available"} primaryText="Available" />
                </DropDownMenu>
                </div>
            </div>
            <Divider />
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
