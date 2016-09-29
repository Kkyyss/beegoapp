import React, {Component} from 'react';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AddRoomTypeDialog from "./RoomTypeComponents/AddRoomTypeDialog.js";

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
  },
  blockCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'center',
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
};

var iuRoomTypes = {
    Campus: "IU", 
    TypesOfRooms: [
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
    ],
    Total: [
    ],
    NotAvailable: [
    ],
};

var iicsRoomTypes = {
    Campus: "IICS",
    TypesOfRooms: [
      'Room A',
    ]
};

var campusDataSource;

export default class RoomTypeConsolePage extends Component {

  componentDidMount() {
    var thisObj = this;
    $.when().then(function() {
      userData = window.UserData;
      switch (userData.campus) {
        case 'IU': 
          campusDataSource = iuRoomTypes;
          break;
        case 'IICS':
          campusDataSource = iicsRoomTypes;
          break;
        case 'ALL':
          // campusDataSource = iuRoomTypes.push(iicsRoomTypes);
          break;
        default:
          break;
      }
      updateRoomStatusList();
    });

    function updateRoomStatusList() {
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
          if (res.error != null) {
            $('#errMsg').text(res.error);
          } else {
            console.log(res.data);
            wrapFunc.SetRoomTypeDataSource(res.data);
            wrapFunc.PaginateRoomTypeContent(res.data);
          }
        }
      });
    }
  }

  render() {
    return (
      <div id="card-wrapper">
        <Card id="card" style={styles.cardSize}>
          <div style={styles.toolBar}>
            <ToolbarTitle text="Room Type Console" />
            <ToolbarSeparator />
            <AddRoomTypeDialog />
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
    );
  }
}
