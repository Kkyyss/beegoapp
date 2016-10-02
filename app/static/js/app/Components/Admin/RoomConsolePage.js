import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AddRoomDialog from "./RoomComponents/AddRoomDialog.js";
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';

require('../CSS/pagination.css');

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;

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
  inputStyle: {
    // border: 'none',
    fontSize: '20px',
    outline: 'none',
    border: 'none',
    margin: '10px 0 10px 0',
    padding: '0 10px 0 10px',
  },
  inputFieldStyle: {
    width: 'auto',
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

const iicsRoomTypes = [
  'Room A',
];

var campusDataSource = iuRoomTypes;

export default class AdminConsolePage extends Component {
  state = {
    value: "IU",
    disabled: false,
  };

  handleChange = (event, index, value) => {
    this.setState({value});
  };

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
        thisObj.changeResource(userCampus);
      }

      updateRoomList();
    }); 

    function updateRoomList() {
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
            wrapFunc.SetRoomDataSource(res.data);
            wrapFunc.PaginateRoomContent(res.data);           
          }
        }
      });
    }

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
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      $('#bg-overlay, #edit-room-box').css('display', 'none');
    });

    $('#update-btn').on('click', updateRoom);

    function updateRoom(e) {
      e.preventDefault();
      var editRoomForm = $('#edit-room-form');
      var editCampus = $('#edit-campus');
      editCampus.val(thisObj.state.value);
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
            updateRoomList();
            wrapFunc.AlertStatus(
              "Success",
              "Update successfully!",
              "success",
              true,
              true
            );
          }
        }
      });
    }
  }

  render() {
    return (
      <div>
        <div id="bg-overlay"></div>
        <Paper id="edit-room-box" zDepth={2}>
          <h1 style={styles.textCenter}>Edit Room</h1>
          <hr/>
          <div className="edit-room-content">
            <form id="edit-room-form">
              <div>
                <input id="edit-room-id" name="edit-room-id" style={styles.hide} />
                Campus&nbsp;
                <DropDownMenu id="edit-campusDropDown" name="edit-campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                  <MenuItem value={"IU"} primaryText="IU" />
                  <MenuItem value={"IICS"} primaryText="IICS" />
                  <MenuItem value={"IICKL"} primaryText="IICKL" />
                  <MenuItem value={"IICP"} primaryText="IICP" />
                </DropDownMenu>
                <input id="edit-campus" name="edit-campus" type="text" style={styles.hide} />
                <br/>
                <AutoComplete
                  id="edit-types-of-rooms"
                  name="edit-types-of-rooms"
                  floatingLabelText="Types of Rooms"
                  floatingLabelFixed={true}
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus={true}
                  dataSource={campusDataSource}
                  fullWidth={true}
                  maxSearchResults={5}
                  floatingLabelStyle={styles.floatingLabelStyle}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}                  
                />
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
                <br/>
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
          <hr/>
            <div className="edit-room-content">
              <RaisedButton
                id="cancel-btn"
                label="Cancel"
                fullWidth={true}
                secondary={true}
                style={styles.raisedButton}
              />
              <RaisedButton 
                id="update-btn"
                label="Update"
                fullWidth={true}
                primary={true}
              />
            </div>
        </Paper>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <div style={styles.toolBar}>
              <ToolbarTitle text="Room Console" />
              <ToolbarSeparator />
              <AddRoomDialog/>
              <input 
                id="search-box"
                placeholder="Search"
                style={styles.inputStyle}
              />
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
