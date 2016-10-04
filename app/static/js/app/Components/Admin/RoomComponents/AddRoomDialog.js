import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';

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
  button: {
    margin: '0 5px 0 5px',
  },  
};

export default class AddRoomDialog extends Component {

  state = {
    open: false,
    campusValue: "IU",
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
  };

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
    $('#types-of-rooms').val(this.state.roomTypeValue);
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

    var userState = {
      userCampus: userData.campus,
    };

    var searchBox = $('#search-box');
    ajax({
      url: "/api/view-room-list",
      method: "POST",
      data: JSON.stringify(userState),
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
      <div>
        <IconButton
          id="add-room-btn"
          iconClassName="fa fa-plus"
          style={styles.button}
          onTouchTap={this.handleOpen}
          tooltip="Add"
          touch={true}
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
              <input id="types-of-rooms" name="types-of-rooms" type="text" style={styles.hide} />
              <br/>
              <TextField
                id="room-no"
                name="room-no"
                floatingLabelText="Room No."
                type="text"
                fullWidth={true}
              />
              <br/><br/>
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
      </div>
    );
  }
}
