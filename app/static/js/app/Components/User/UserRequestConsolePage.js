import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import DatePicker from 'material-ui/DatePicker';


var $ = window.Jquery;
var ajax = $.ajax;
var moment = window.Moment;
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
  inputStyle: {
    // border: 'none',
    fontSize: '20px',
    outline: 'none',
    border: 'none',
    margin: '10px 0 10px 0',
    padding: '0 10px 0 10px',
  },
  textField: {
    width: 'auto',
  },
  wall: {
    marginLeft: '10px',
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
  blockCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: '0 15px 0 15px',
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
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  bottomLine: {
    borderBottom: '1px solid #a4a4a6',
  },
  textGray: {
    color: '#939598',
  },
  dateAlign: {
    verticalAlign:'bottom',
  },
  button: {
    margin: 10,
  },
  hide: {
    display: 'none',
  },
};

function disableDays(date) {
  return date.getDay() >= 0 && date.getDay() <= 6;
}

function formatDate(date) {
  return moment(date).format('YYYY-MM');
}

export default class UserRequestConsolePage extends Component {
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
      disabled: false,
    };
  }

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      updateRequestList();
      $('#payment-submit').on('click', madePayment);
    });

    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewRequestResize();

    $(window).on('window:resize', viewRequestResize);

    function viewRequestResize() {
      var windowHeight = $(window).height();
      var viewRequestBox = $('#view-request-box');
      var paymentBox = $('#payment-box');
      var windowWidth = $(window).width();      
      viewRequestBox.width(windowWidth * 0.8);
      viewRequestBox.height(windowHeight * 0.8);
      paymentBox.width(windowWidth * 0.8);
      paymentBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewRequestBox.height() - 140;
      $('.dialog-content').height(dialogContentHeight);
    }
    $('#bg-overlay, #cancel-btn, #payment-cancel').on('click', function() {
      $('#bg-overlay, #view-request-box, #payment-box').css('display', 'none');
    });

    

    function madePayment() {
      thisObj.setState({
        disabled: true,
      });

      var paymentForm = $('#payment-form');
      $('#nap').val($('net-amount-payable').text());
      ajax({
        url: "/user/request",
        method: "POST",
        cache: false,
        data: paymentForm.serialize(),
        beforeSend: function() {
          wrapFunc.LoadingSwitch(true);
        },
        success: function(res) {
          wrapFunc.LoadingSwitch(false);
          if (res.length != 0) {
            wrapFunc.AlertStatus(
              'Oops...',
              res,
              'error',
              false,
              false
            );
          } else {
            $('#bg-overlay, #payment-box').css('display', 'none');
            updateRequestList();
          }
          thisObj.setState({
            disabled: false,
          });          
        }        
      });
    }

    function updateRequestList() {
      console.log(userData.id);
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
  }

  render() {
    return (
      <div>
        <div id="bg-overlay"></div>
        <div id="view-request-box">
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
                    id="view-dp"
                    floatingLabelText="Deposit(RM)"
                    floatingLabelFixed={true}
                    underlineShow={false}
                    readOnly={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                  />
                  <TextField
                    id="view-rpp"
                    floatingLabelText="Rates Per Person(RM)"
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
        </div>
        <div id="payment-box">
          <div className="dialog-header">
            <h1 style={styles.textCenter}>Payment</h1>
          </div>
          <div className="dialog-content">
            <div className="table-hero">
              <div className="tableWrapperPay">
              <form id="payment-form">
                <table className="tableBody">
                  <input id="req-id" name="req-id" type="text" style={styles.hide} />
                  <input id="usr-id" name="usr-id" type="text" style={styles.hide} />
                  <input id="nap" name="nap" type="text" style={styles.hide} />
                  <tbody>
                      <tr>
                        <td colSpan="2" style={styles.textCenter}>
                          <span style={styles.textGray}>Pay with Credit Card</span>
                          &nbsp;&nbsp;&nbsp;<img src="../static/img/credit-cards.png" width="128x128" />
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.textLeft}>
                          <TextField
                            id="card-no"
                            name="card-no"
                            floatingLabelText="Card Number"
                            style={styles.textField}
                          />
                        </td>
                        <td style={styles.textRight}>
                          <TextField
                            id="card-name"
                            name="card-name"
                            floatingLabelText="Name On Card"
                            style={styles.textField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.dateAlign}>
                          <DatePicker 
                            id="card-exp"
                            name="card-exp"
                            hintText="Expire Date" 
                            formatDate={formatDate}
                            mode="landscape"
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                          />
                        </td>
                        <td style={styles.textRight}>
                          <TextField
                            id="card-cvv"
                            name="card-cvv"
                            floatingLabelText="CVV"
                            style={styles.textField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={styles.textCenter}>
                          <RaisedButton 
                            id="payment-submit"
                            label="Go"
                            primary={true}
                            fullWidth={true}
                            disabled={this.state.disabled}
                          />
                        </td>                        
                      </tr>
                    </tbody>
                </table>
              </form>
              </div>
              <div className="tableWrapperNap">
                <table className="tableBody">
                  <tbody>
                  <tr>
                    <td></td>
                    <td style={styles.textLeft}>Deposit</td>
                    <td style={styles.textRight}><span id="payment-dp"></span></td>
                  </tr>
                  <tr style={styles.bottomLine}>
                    <td style={styles.textLeft}><FontIcon className="fa fa-plus" /></td>
                    <td style={styles.textLeft} >Rates Per Person</td>
                    <td style={styles.textRight}><span id="payment-rpp"></span></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={styles.textLeft} >Payment</td>
                    <td style={styles.textRight}><span id="payment-amount"></span></td>
                  </tr>
                  <tr style={styles.bottomLine}>
                    <td style={styles.textLeft}><FontIcon className="fa fa-plus" /></td>
                    <td style={styles.textLeft} >Amount B/F</td>
                    <td style={styles.textRight}><span id="user-balance"></span></td>
                  </tr>
                  <tr style={styles.bottomLine}>
                    <td></td>
                    <td style={styles.textLeft} >Net Amount Payable</td>
                    <td style={styles.textRight}><span id="net-amount-payable"></span></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="clearfix"></div>
            <div style={styles.blockContent}>
            </div>
          </div>
          <div className="dialog-footer">
            <div style={styles.rightAlign}>
              <RaisedButton 
                id="payment-cancel"
                label="Cancel"
                secondary={true}
              />
            </div>
            <div style={styles.clearFix}></div>
          </div>
        </div>        
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <div style={styles.toolBar}>
              <ToolbarTitle text="User Request Console" />
              <ToolbarSeparator />
              <span style={styles.wall}></span>
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
