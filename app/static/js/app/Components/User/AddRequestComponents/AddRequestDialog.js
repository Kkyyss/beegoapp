import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';

var $ = window.Jquery;
var ajax = $.ajax;
var moment = window.Moment;
var swal = window.SweetAlert;
var wrapFunc = window.Wrapper;
var userData;

const styles = {
  cardSize: { 
    marginTop: '50px',
    marginBottom: '50px',
    // left: '15%',
    marginLeft: '15%',
    width: '70%',
  },
  cardWrapper: {
    position: 'relative',
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentPadding: {
    margin: '0 25% 0 25%',
    paddingBottom: '25px',
  },
  nextedCardSize: {
    width: '100%',
    padding: '15px',
  },
  titleStyle: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: '1.5em',
    padding: '10px 0 10px 15px',
  },
  inputField: {
    width: 'auto',
  },
  wall: {
    margin: '0 15px',
  },
  flexWrap:{
    display: 'flex',
    flexWrap: 'wrap',
  },
  gaps: {
    marginTop: '20px',
  },
  hide: {
    display: 'none',
  },
  radioButton: {
    marginBottom: 16,
  },
};

var roomDataSource;
var campusDataSource = [];
var isValid = false;

function disableMonths(date) {
  return date.getMonth() >= 10 && date.getMonth() <= 11;
}

function formatDate(date) {
  return moment(date).format('YYYY MMMM');
}

export default class AddRequestDialog extends Component {
  constructor(props) {
    super(props);

    const minDate = new Date();
    const maxDate = new Date();
    minDate.setFullYear(minDate.getFullYear());
    minDate.setHours(0, 0, 0, 0);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);

    this.state = {
      minDate: minDate,
      maxDate: maxDate,
      value: "IU",
      disabled: false,
      btnDisabled: false,
      roomTypeValue: "",
      roomTypeDisabled: false,
      open: false,
    };
  }

  handleRoomTypeChange = (event, index, value) => {
    this.setState({
      roomTypeValue: value,
    });
    this.setPayment(roomDataSource, index);
  };

  handleOpen = (e) => {
    var thisObj = this;
    if (!userData.fillUpProfile) {
      swal({
        title: '<i>Oops...</i>',
        type: 'info',
        html:
          'You <b>must complete</b> the '+
          '<a href="/user/account">Profile</a> ' +
          'in order to send booking request.',
         allowOutsideClick: false,
         allowEscapeKey: false,  
      });
      return;
    }

    thisObj.setState({open: true}, afterOpened);

    function afterOpened(){
      $('#form-user-id').val(userData.id);
      thisObj.setPayment(roomDataSource, 0);

      var sessionDate = $('#session-date');
      sessionDate.on('focusout', thisObj.vrfSession);
    }
  };

  handleClose = (e) => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    var requestForm = $('#request-form');
    thisObj.setState({
      btnDisabled: true,
    });
    var finalValidation = thisObj.validFunc(thisObj.vrfSession());

    if (!finalValidation) {
      thisObj.setState({
        btnDisabled: false,
      });
      return false;
    }

    $('#campus').val(thisObj.state.value);
    $('#gender').val(userData.gender);
    $('#types-of-rooms').val(thisObj.state.roomTypeValue);
    $('#deposit').val($('#r-deposit').val());
    $('#rates_per_person').val($('#r-rpp').val());
    $('#payment').val($('#r-payment').val());

    ajax({
      url: "/user/booking-form",
      method : "POST",
      data : requestForm.serialize(),
      cache: false,
      beforSend: function() {
        wrapFunc.LoadingSwitch(true);
      },
      success: function(res) {
        wrapFunc.LoadingSwitch(false);
        if (res.length != 0) {
          wrapFunc.AlertStatus(
            'Oopps..',
            res,
            'error',
            false,
            false
          );
        } else {
          wrapFunc.AlertStatus(
            'Success',
            'Your request has been submitted successfully.',
            'success',
            false,
            false
          );
          thisObj.updateRequestList();
        }
        thisObj.setState({
          open: false,
          btnDisabled: false,
        });
      }
    });
  };

  updateRequestList() {
    var userState = {
      userId: userData.id
    };

    ajax({
      url: "/api/user-request-list",
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
          wrapFunc.SetUserRequestDataSource(res.data);
          wrapFunc.PaginateUserRequestContent(res.data);
        }
      }
    });
  }  

  vrfSession() {
    var sessionDate = $('#session-date');
    var ssdMsg = $('#ssdMsg');
    var plainText = sessionDate.val().trim();
    isValid = wrapFunc.BasicValidation(
      (plainText.length != 0),
      ssdMsg,
      "Please don't leave it empty.",
      sessionDate
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      sessionDate,
      ssdMsg,
      "Please don't leave it empty."
    );
  }

  validFunc(func) {
     func;
     if (isValid) {
       return true;
     }
     return false;
  }

  getUserList() {
    var thisObj = this;

    var searchBox = $('#search-box');
    ajax({
      url: "/api/view-admin-list",
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
          wrapFunc.SetAdminDataSource(res.data);
          wrapFunc.PaginateAdminContent(res.data);
        }
      }
    });
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function(x) {
      userData = window.UserData;
      thisObj.getRoomTypeList();
      if (userData.campus !== 'ALL') {
        var userCampus = userData.campus;
        thisObj.setState({
          value: userCampus,
          disabled: true,
        });
      }
    });
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
          roomDataSource = res.data;
          thisObj.getRoomTypes(res.data);
          thisObj.setState({
            roomTypeDisabled: false,
          });
        }
      }
    });
  }

  setPayment(data, index) {
    $('#r-deposit').val(data[index].Deposit);
    $('#r-rpp').val(data[index].RatesPerPerson);
    $('#r-payment').val(data[index].Deposit + data[index].RatesPerPerson);
  }

  getRoomTypes(data) {
    campusDataSource = [];
    for (let i = 0; i < data.length; i++) {
      campusDataSource.push(<MenuItem value={data[i].TypesOfRooms} key={data[i].TypesOfRooms} primaryText={data[i].TypesOfRooms} />);
    }

    this.setState({
      roomTypeValue: data[0].TypesOfRooms,
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
        onClick={this.handleSubmit}
        disabled={this.state.btnDisabled}
      />,
    ];

    return (
      <div>
          <IconButton
            id="add-req-btn"
            iconClassName="fa fa-plus"
            style={styles.button}
            onTouchTap={this.handleOpen}
          />
          <Dialog
            title="Add Request"
            className="add-req-dialog"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <form id="request-form">
              <input type="text" style={styles.hide} name="form-user-id" id="form-user-id" />
              <p style={styles.titleStyle}>Campus & Types of Rooms</p>
              <div className="content-padding">
                Campus&nbsp;
                <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                  <MenuItem value={"IU"} primaryText="IU" />
                  <MenuItem value={"IICS"} primaryText="IICS" />
                  <MenuItem value={"IICKL"} primaryText="IICKL" />
                  <MenuItem value={"IICP"} primaryText="IICP" />
                </DropDownMenu>
                <input id="campus" name="campus" type="text" style={styles.hide} />
                <br/><br/>
                Types Of Rooms&nbsp;
                <DropDownMenu maxHeight={250} id="roomTypesDropDown" value={this.state.roomTypeValue} onChange={this.handleRoomTypeChange} disabled={this.state.roomTypeDisabled}>
                  {campusDataSource}
                </DropDownMenu>
                <input id="types-of-rooms" name="types-of-rooms" type="text" style={styles.hide} />
                <br/>
              </div>
              <p style={styles.titleStyle}>SESSION</p>
              <div className="content-padding">
                <DatePicker 
                  id="session-date"
                  name="session-date"
                  hintText="Session Date" 
                  formatDate={formatDate}
                  mode="landscape"
                  minDate={this.state.minDate}
                  maxDate={this.state.maxDate}
                  shouldDisableDate={disableMonths}
                />
                <div id="ssdMsg">Please don't leave it empty.</div>
              </div>
              <p style={styles.titleStyle}>Payment</p>
              <div className="content-padding">
                <TextField
                  floatingLabelText="Deposit"
                  floatingLabelFixed={true}
                  type="text"
                  name="r-deposit"
                  id="r-deposit"
                  defaultValue={0}
                  fullWidth={true}
                  readOnly={true}
                />
                <input id="deposit" name="deposit" type="text" style={styles.hide} />
                <TextField
                  floatingLabelText="Rates Per Person"
                  floatingLabelFixed={true}
                  type="text"
                  name="r-rpp"
                  id="r-rpp"
                  defaultValue={0}
                  fullWidth={true}
                  readOnly={true}
                />
                <input id="rates_per_person" name="rates_per_person" type="text" style={styles.hide} />              
                <TextField
                  floatingLabelText="Total"
                  floatingLabelFixed={true}
                  type="text"
                  name="r-payment"
                  id="r-payment"
                  defaultValue={0}
                  fullWidth={true}
                  readOnly={true}
                />
                <input id="payment" name="payment" type="text" style={styles.hide} />
                <input id="gender" name="gender" type="text" style={styles.hide} />
              </div>          
            </form>
          </Dialog>
      </div>
    );
  }
}
