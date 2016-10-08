import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Card} from 'material-ui/Card';

var $ = window.Jquery;
var swal = window.SweetAlert;
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
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  errMsg: {
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
  },
  bottomLine: {
    borderBottom: '1px solid #a4a4a6',
  },  
};


export default class UserBookedRoomPage extends Component {


  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      thisObj.getBookedRoom();
    });
  }

  getBookedRoom() {
    var userState = {
      userId: userData.id
    };
    ajax({
      url: "/user/booked-room",
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
          $('#booked-content').remove();
        } else {
          $('#errMsg').remove();
          console.log(res.data);
          var bookedData = res.data.Room;
          $('#booked-cp').text(bookedData.Campus);
          $('#booked-tor').text(bookedData.TypesOfRooms);
          $('#booked-no').text(bookedData.RoomNo);
          $('#booked-dp').text(bookedData.Deposit);
          $('#booked-r').text(bookedData.RatesPerPerson);

          if (res.roommate !== undefined) {
            console.log(res.roommate);
            $('#no-roommate').remove();
          }
        }
        $('#card').removeClass('hide');
      }
    });
  }

  render() {
    return (
      <div>
        <div id="card-wrapper" className="wrapper-margin">
            <h1 style={styles.errMsg} id="errMsg"></h1>

            <div id="booked-content">
            <div className="table-hero">
              <div className="u-booked-left">
                <h1 style={styles.textCenter}>Booked Room</h1>
                <div className="block-center">
                  <table>
                    <tbody>
                      <tr style={styles.bottomLine}>
                        <td style={styles.textLeft}>Campus</td>
                        <td style={styles.textCenter}><b><span id="booked-cp"></span></b></td>
                      </tr>
                      <tr style={styles.bottomLine}>
                        <td style={styles.textLeft}>Types</td>
                        <td style={styles.textCenter}><b><span id="booked-tor"></span></b></td>
                      </tr>
                      <tr style={styles.bottomLine}>
                        <td style={styles.textLeft}>No.</td>
                        <td style={styles.textCenter}><b><span id="booked-no"></span></b></td>
                      </tr>
                      <tr style={styles.bottomLine}>
                        <td style={styles.textLeft}>Deposit</td>
                        <td style={styles.textCenter}><b><span id="booked-dp"></span></b></td>
                      </tr>
                      <tr>
                        <td style={styles.textLeft}>Rates</td>
                        <td style={styles.textCenter}><b><span id="booked-r"></span></b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="half-wrapper">
                <h1 style={styles.textCenter}>Roommate</h1>
                <div className="block-center">
                  <h1 style={styles.errMsg} id="no-roommate">N/A</h1>
                </div>
              </div>
            </div>
            </div>

        </div>
      </div>
    );
  }
}
