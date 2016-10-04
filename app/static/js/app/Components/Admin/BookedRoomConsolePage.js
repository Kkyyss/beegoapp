import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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
  wall: {
    marginLeft: '10px',
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
  bgColor: {
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    margin: 0,    
  },  
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
  },  
  textRight: {
    textAlign: 'right',
  },
  flexContent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 'auto',
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

  sortByCampus(a, b) {
    var aCampus = a.Campus.toLowerCase();
    var bCampus = b.Campus.toLowerCase();
    return ((aCampus < bCampus) ? -1 : ((aCampus > bCampus) ? 1 : 0));
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
          console.log(res.data);
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
            <h1 style={styles.textCenter}>Edit Room</h1>
          </div>
          <div className="dialog-content">
            <h1 style={styles.bgColor}>User Details</h1>
              <div className="table-hero">
                <Card className="view-content-card">
                <table className="tableBody">
                  <tbody>
                    <tr>
                      <td style={styles.textLeft}>Full Name</td>
                      <td style={styles.textLeft}>
                        <span id="view-booked-name"></span>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.textLeft}>Student Id</td>
                      <td style={styles.textLeft}>
                        <span id="view-booked-si"></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </Card>
              </div>
          </div>
          <div className="dialog-footer">
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
