import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';

import RoomTypeDropdownList from '../RoomTypeDropdownList.js';

import swal from 'sweetalert2';

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;
var items = [];

const styles = {
  hide: {
    display: 'none',
  },
  formStyle: {
    marginLeft: '25%',
    width: '50%',
  },
  customWidth: {
    width: '100%',
  },
  toggle: {
    marginBottom: 16,
  },
};

// const iuRoomTypes = [
//   'SR(NAC) RM430',
//   'SR(AC) RM730',
//   'TSR(NAC-1) RM330',
//   'TSR(NAC-2) RM410',
//   'TSR(AC) RM630',
//   'RAB(AC-1) RM1,110',
//   'RAB(AC-2) RM790',
//   'RAB(AC-3) RM710',
//   'RAB(AC-4) RM770',
//   'SP(AC-1) RM1,490',
//   'SP(AC-2) RM1,380',
// ];

export default class AddRoomDialog extends Component {

  state = {
    open: false,
    campusValue: "ALL",
    roomTypeValue: "",
    disabled: false,
    roomTypeDisabled: false,
    btnDisabled: false,
  };

  handleCampusChange = (event, index, value) => {
    items = [];
    this.changeResource(value);
  };

  handleRoomTypeChange = (event, index, value) => {
    this.setState({
      roomTypeValue: value,
    });
  }

  handleOpen = (e) => {
    if (this.state.roomTypeDisabled) {
      wrapFunc.AlertStatus(
        "Oops...",
        "Don't have room types.",
        "error",
        false,
        false
      );

      return;
    }
    this.setState({open: true});
  };

  handleClose = (e) => {
    this.setState({open: false});
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

  generateCampusItem(data) {
    for (let i = 0; i < data.length; i++ ) {
      items.push(<MenuItem value={data[i].TypesOfRooms} key={data[i].TypesOfRooms} primaryText={data[i].TypesOfRooms} />);
    }
    this.setState({
      roomTypeValue: data[0].TypesOfRooms,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    thisObj.setState({
      btnDisabled: true,
    });    
    $('#campus').val(this.state.campusValue);
    var addRoomForm = $('#add-room-form');
    ajax({
      url: "/user/room-console",
      method: "POST",
      data: addRoomForm.serialize(),
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
          thisObj.setState({open: false});
          thisObj.getRoomList();
          wrapFunc.AlertStatus('Success', 'Room Added Successfully!', 'success', true, true);
        }
        thisObj.setState({
          btnDisabled: false,
        });
        return;
      }
    });
  };

  componentDidMount() {
    var thisObj = this;
    $.when().then(function(x) {
      userData = window.UserData;
      thisObj.getRoomTypeList();
      if (userData.campus !== 'ALL') {
        var userCampus = userData.campus;
        thisObj.setState({
          campusValue: userCampus,
          disabled: true,
        });
      }
    });
  }

  getRoomList() {
    var thisObj = this;

    var searchBox = $('#search-box');
    ajax({
      url: "/api/view-room-list",
      method: "POST",
      cache: false,
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

  getRoomTypeList() {
    var userState = {
      userCampus: userData.campus
    };

    this.onAjaxRequest(userState);
  }

  getRoomByCampusOnChange(value) {
    var campusState = {
      userCampus: value
    };

    this.onAjaxRequest(campusState);
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

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        id="submit-btn"
        label="Go!"
        primary={true}
        onTouchTap={this.handleSubmit}
        disabled={this.state.btnDisabled}
      />,
    ];

    return (
      <ToolbarGroup>
        <RaisedButton 
          id="add-room-btn"
          label="Add Room" 
          primary={true}
          icon={<FontIcon className="fa fa-plus" />}
          onTouchTap={this.handleOpen}
        />
        <Dialog
          title="Add Room"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <form id="add-room-form" style={styles.formStyle} className="add-room-style">
            <div>Campus&nbsp;
              <DropDownMenu maxHeight={250} id="campusDropDown" value={this.state.campusValue} onChange={this.handleCampusChange} disabled={this.state.disabled}>
                <MenuItem value={"ALL"} primaryText="ALL" />
                <MenuItem value={"IU"} primaryText="IU" />
                <MenuItem value={"IICS"} primaryText="IICS" />
                <MenuItem value={"IICKL"} primaryText="IICKL" />
                <MenuItem value={"IICP"} primaryText="IICP" />
              </DropDownMenu>
              <input id="campus" name="campus" type="text" style={styles.hide} />
              <br/><br/>
              Types Of Rooms&nbsp;
              <DropDownMenu maxHeight={250} id="roomTypesDropDown" value={this.state.roomTypeValue} onChange={this.handleRoomTypeChange} disabled={this.state.roomTypeDisabled}>
                {items}
              </DropDownMenu>
              <br/>              
              <TextField
                id="room-no"
                name="room-no"
                floatingLabelText="Room No."
                type="text"
                fullWidth={true}
              />
              <TextField
                id="per-month-fee"
                name="per-month-fee"
                floatingLabelText="Per Month Fee (RM)"
                type="text"
                fullWidth={true}
              />
              <br/><br/>
              <Toggle
                id="twin"
                name="twin"
                label="Twin"
                defaultToggled={false}
                style={styles.toggle}
              />
              <Toggle
                id="available"
                name="available"
                label="Available"
                defaultToggled={true}
                style={styles.toggle}
              />
            </div>
          </form>
        </Dialog>
      </ToolbarGroup>
    );
  }
}
