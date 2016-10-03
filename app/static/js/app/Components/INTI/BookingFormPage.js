import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {redA700} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';

var $ = window.Jquery;
var ajax = $.ajax;
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

const sessionMonthDataSource = [
  "January",
  "February",
  "March",
  "Apirl",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
];

var roomDataSource;
var campusDataSource = [];
export default class BookingFormPage extends Component {
  state = {
    value: "IU",
    disabled: false,
    btnDisabled: false,
    roomTypeValue: "",
    roomTypeDisabled: false,
  };

  handleRoomTypeChange = (event, index, value) => {
    this.setState({
      roomTypeValue: value,
    });
    this.setPayment(roomDataSource, index);
  };

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

    var reqeustForm = $('#request-form');
    var isValid = false;
    var submitRequstButton = $('#submit-request');
    submitRequstButton.click(submitRequest);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(reqeustForm);
    function submitRequest(ev) {
      ev.preventDefault();
      var finalValidation = validFunc(monthVrf()) &
                validFunc(yearVrf());
               
      if (!finalValidation) {
        return false;
      }
      thisObj.setState({
        btnDisabled: true,
      });
      $('#campus').val(thisObj.state.value);
      $('#types-of-rooms').val(thisObj.state.roomTypeValue);
      $('#deposit').val($('#r-deposit').val());
      $('#rates_per_person').val($('#r-rpp').val());
      $('#payment').val($('#r-payment').val());
      ajax({
        url: "/user/booking-form",
        method : "POST",
        data : reqeustForm.serialize(),
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
            swal({
              title: 'Yeahhh...',
              text: 'Your request has been submitted successfully.',
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(function() {
              $(location).prop('href', '/');
            });
          }
          thisObj.setState({
            btnDisabled: false,
          });           
        }
      });
    }

    var sessMonth = $('#session-month');
    var monthMsg = $('#monthMsg');
    sessMonth.on({
      'input focusout': monthVrf,
    });

    function monthVrf() {
      var plainText = sessMonth.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText.length != 0),
        monthMsg,
        "Please don't leave it empty.",
        sessMonth
      );
      if (!isValid) {
        return;
      }
      isValid = wrapFunc.BasicValidation(
        ($.inArray(plainText, sessionMonthDataSource) != -1),
        monthMsg,
        "Invalid session month.",
        sessMonth
      );
      if (!isValid) {
        return;
      }      
      wrapFunc.MeetRequirement(
        sessMonth, 
        monthMsg, 
        "Please don't leave it empty."
      );      
    }

    var sessYear = $('#session-year');
    var yearMsg = $('#yearMsg');
    sessYear.on({
      'input focusout': yearVrf,
    });

    function yearVrf() {
      var plainText = sessYear.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/^[0-9]{4}$/),
        yearMsg,
        "Please don't leave it empty and not more than 4 digit.",
        sessYear
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        sessYear, 
        yearMsg, 
        "Please don't leave it empty and not more than 4 digit."
      );
    }

    function validFunc(func) {
     func;
     if (isValid) {
       return true;
     }
     return false;
    }
  }

  getRoomTypeList() {
    var userState = {
      userCampus: userData.campus
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
          thisObj.setPayment(roomDataSource, 0);
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
    return (
      <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
        <Card id="card" name="iu-card" style={styles.cardSize}>
          <div id="form-warning">
            <CardTitle title="Please complete user Profile" subtitle="Require complete the user profile..."/>
            <a href="/user/account">Complete User Profile</a>
          </div>
          <div id="form-content">
            <CardTitle title="ACOMMODATION APPLICATION FORM" subtitle="Please fill up the blanks."/>
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
                <AutoComplete
                  id="session-month"
                  name="session-month"
                  floatingLabelText="Month"
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus={true}
                  dataSource={sessionMonthDataSource}
                  fullWidth={true}
                  maxSearchResults={4}
                />
                <div id="monthMsg">Please don't leave it empty.</div>
                <br/>
                <TextField
                  floatingLabelText="Year"
                  type="text"
                  name="session-year"
                  id="session-year"
                  fullWidth={true}
                />
                <div id="yearMsg">Please don't leave it empty and not more than 4 digit.</div>
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
              </div>
              <RaisedButton 
                label="GO!"
                primary={true}
                fullWidth={true}
                id="submit-request"
                disabled={this.state.btnDisabled}
              />            
            </form>
          </div>        
        </Card>
      </div>
    );
  }
} 
