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

import swal from 'sweetalert2';

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;

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

export default class AddRoomTypeDialog extends Component {
  state = {
    open: false,
    value: "IU",
    disabled: false,
    btnDisabled: false,
  };

  handleChange = (event, index, value) => {
    this.setState({value});
  };

  handleOpen = (e) => {
    this.setState({open: true});
  };

  handleClose = (e) => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    thisObj.setState({
      btnDisabled: true,
    });    
    $('#campus').val(this.state.value);
    var addRoomTypeForm = $('#add-room-type-form');
    ajax({
      url: "/user/room-type-console",
      method: "POST",
      data: addRoomTypeForm.serialize(),
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
          thisObj.getRoomTypeList();
          wrapFunc.AlertStatus('Success', 'Room Added Successfully!', 'success', true, true);
        }
        thisObj.setState({
          btnDisabled: false,
        });
        return;
      }
    });
  };

  getRoomTypeList() {
    var thisObj = this;

    var userState = {
      userCampus: userData.campus
    };

    var searchBox = $('#search-box');
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
          wrapFunc.SetRoomTypeDataSource(res.data);
          wrapFunc.PaginateRoomTypeContent(res.data);
        }
      }
    });
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
          id="add-room-type-btn"
          label="Add Room Type" 
          primary={true}
          icon={<FontIcon className="fa fa-plus" />}
          onTouchTap={this.handleOpen}
        />
        <Dialog
          title="Add Room Type"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <form id="add-room-type-form" style={styles.formStyle} className="add-room-type-style">
            <div>Campus&nbsp;
              <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                <MenuItem value={"IU"} primaryText="IU" />
                <MenuItem value={"IICS"} primaryText="IICS" />
                <MenuItem value={"IICKL"} primaryText="IICKL" />
                <MenuItem value={"IICP"} primaryText="IICP" />
              </DropDownMenu>
              <input id="campus" name="campus" type="text" style={styles.hide} />
              <br/>
              <TextField
                id="types-of-rooms"
                name="types-of-rooms"
                floatingLabelText="Types of Rooms"
                type="text"
                fullWidth={true}  
              />
              <br/>
              <TextField
                id="deposit"
                name="deposit"
                floatingLabelText="Deposit"
                type="text"
                fullWidth={true}
              />
              <br/>
              <TextField
                id="rates-per-person"
                name="rates-per-person"
                floatingLabelText="Rates Per Person"
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
            </div>
          </form>
        </Dialog>
      </ToolbarGroup>
    );
  }
}
