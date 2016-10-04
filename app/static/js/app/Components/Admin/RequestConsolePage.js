import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
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
  title: {
    marginLeft: 10,
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
  rightAlign: {
    float: 'right',      
    margin: 10,
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
    thisObj.updateRequestList();
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
      thisObj.updateRequestList();
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewRequestResize();

    $(window).on('window:resize', viewRequestResize);

    function viewRequestResize() {
      var windowHeight = $(window).height();
      var viewRequestBox = $('#view-request-box'); 
      var windowWidth = $(window).width();      
      viewRequestBox.width(windowWidth * 0.8);
      viewRequestBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewRequestBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);        
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      $('#bg-overlay, #view-request-box').css('display', 'none');
    });

   
  }

  updateRequestList() {
    var userState = {
      userCampus: userData.campus
    };

    ajax({
      url: "/api/view-request-list",
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
          wrapFunc.SetRequestDataSource(res.data);
          wrapFunc.PaginateRequestContent(res.data);
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
        <div id="view-request-box" zDepth={2}>
          <div className="dialog-header">
            <h1 style={styles.textCenter}>View Request</h1>
          </div>
          <div className="dialog-content">
          <h1 style={styles.bgColor}>User Details</h1>   
          <div style={styles.blockContent}>
                <TextField
                  id="view-user-name"
                  floatingLabelText="Full Name"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-user-si"
                  floatingLabelText="Student Id"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />                 
                <TextField
                  id="view-user-gender"
                  floatingLabelText="Gender"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-user-contactno"
                  floatingLabelText="Contact No."
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />           
                <TextField
                  id="view-user-location"
                  floatingLabelText="Permanent Address"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-user-session"
                  floatingLabelText="Session"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
            </div>

              <h1 style={styles.bgColor}>Room Details</h1> 
              <div style={styles.blockContent}>
                <TextField
                  id="view-rd"
                  floatingLabelText="Request Date"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                /> 
                <TextField
                  id="view-tp"
                  floatingLabelText="Types Of Rooms"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-s"
                  floatingLabelText="Status"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-dmd"
                  floatingLabelText="Decision Made On"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
                <TextField
                  id="view-py"
                  floatingLabelText="Payment(RM)"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  readOnly={true}
                  floatingLabelStyle={styles.floatingLabelStyle}
                />
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
          <h1 style={styles.title}>Request Console</h1>
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
                <div style={styles.wall}>
                Sort By&nbsp;
                <DropDownMenu maxHeight={250} id="sortDropDownMenu" value={this.state.sortValue} onChange={this.handleSortTypeChange}>
                  <MenuItem value={"Campus"} primaryText="Campus" />
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
