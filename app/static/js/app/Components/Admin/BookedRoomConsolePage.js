import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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
  wall: {
    marginLeft: '10px',
  },
  contentStyle: {
    padding:'25px',
  },
  textCenter: {
    textAlign: 'center',
  },
  floatingLabelStyle: {
    color: '#1A237E',
    fontStyle: 'normal',
  },  
};

export default class BookedRoomConsolePage extends Component {

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      updateBookedList();
    });


    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewBookedResize();

    $(window).on('window:resize', viewBookedResize);    

    function viewBookedResize() {
      var windowHeight = $(window).height();
      var viewBookedBox = $('#view-booked-box');
      var windowWidth = $(window).width();
      viewBookedBox.width(windowWidth * 0.8);
      viewBookedBox.height(windowHeight * 0.8);
    }
    $('#bg-overlay, #cancel-btn').on('click', function() {
      $('#bg-overlay, #view-booked-box').css('display', 'none');
    });

    function updateBookedList() {
      var userState = {
        userCampus: userData.campus
      };

      ajax({
        url: "/api/view-booked-list",
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
            wrapFunc.SetBookedDataSource(res.data);
            wrapFunc.PaginateBookedContent(res.data);
          }
        }
      });
    }     
  }

  render() {
    return (
      <div>
        <div id="bg-overlay"></div>
        <Paper id="view-booked-box" zDepth={2}>
          <h1 style={styles.textCenter}>View Booked Room</h1>
          <hr/>
        </Paper>
        <div id="card-wrapper">
          <Card id="card" style={styles.cardSize}>
            <div style={styles.toolBar}>
              <ToolbarTitle text="Booked Room Console" />
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
