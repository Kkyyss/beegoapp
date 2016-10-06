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
        }
        $('#card').removeClass('hide');
      }
    });
  }

  render() {
    return (
      <div>
        <div id="card-wrapper" className="wrapper-margin">
          <Card id="card" className="hide" style={styles.cardSize}>
            <p style={styles.textCenter} id="errMsg"></p>
            <div id="booked-content">
              <h1 style={styles.textCenter}>Booked Room</h1>
              <table>
                <tbody>
                  <tr>
                    <td>Campus</td>
                    <td style={styles.textCenter}><b><span id="booked-cp"></span></b></td>
                  </tr>
                  <tr>
                    <td>Types</td>
                    <td style={styles.textCenter}><b><span id="booked-tor"></span></b></td>
                  </tr>
                  <tr>
                    <td>No.</td>
                    <td style={styles.textCenter}><b><span id="booked-no"></span></b></td>
                  </tr>
                  <tr>
                    <td>Deposit</td>
                    <td style={styles.textCenter}><b><span id="booked-dp"></span></b></td>
                  </tr>
                  <tr>
                    <td>Rates</td>
                    <td style={styles.textCenter}><b><span id="booked-r"></span></b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
