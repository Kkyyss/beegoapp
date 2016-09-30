import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import swal from 'sweetalert2';

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;
var campusDataSource = [];


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

var items = [];

export default class RoomTypeDropdownList extends Component {
  state = {
    open: false,
    disabled: false,
  };

  handleChange = (event, index, value) => {
    this.setState({value});
    $('#types-of-rooms').val(value);
    console.log(value);
  };

  handleOpen = (e) => {
    this.setState({open: true});
  };

  handleClose = (e) => {
    this.setState({open: false});
  };

  generateCampusItem(data) {
    for (let i = 0; i < data.length; i++ ) {
      items.push(<MenuItem value={data[i].TypesOfRooms} key={data[i].TypesOfRooms} primaryText={data[i].TypesOfRooms} />);
    }
    if (data.length != 0) {
      this.setState({
        value: data[0].TypesOfRooms,
      })
    }
  }  

  getRoomTypeList() {
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
        if (res.error == null) {
          console.log(res.data);
          campusDataSource = res.data;
          thisObj.generateCampusItem(campusDataSource);
        } else {
          thisObj.setState({
            disabled: true,
          });
        }
      }
    });
  }

  componentDidMount() {
    items = [];
    var thisObj = this;
    userData = window.UserData;
    thisObj.getRoomTypeList();
  }

  render() {
    return (
      <DropDownMenu maxHeight={250} value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
        {items}
      </DropDownMenu>
    );
  }
}
