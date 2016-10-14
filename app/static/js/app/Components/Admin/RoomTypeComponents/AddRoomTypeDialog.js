import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';

import swal from 'sweetalert2';

var $ = window.Jquery;
var ajax = $.ajax;
var wrapFunc = window.Wrapper;
var userData;
var isValid = false;

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
    var thisObj = this;
    this.setState({open: true}, afterOpened);

    function afterOpened() {
      var eTor = $('#types-of-rooms');
      eTor.on('input focusout', thisObj.vrfEditTor);

      var eDp = $('#deposit');
      eDp.on('input focusout', thisObj.dpNumeric);

      var eRpp = $('#rates-per-person');
      eRpp.on('input focusout', thisObj.rppNumeric);

      var gdr = $('input[name=gender]');
      gdr.on('click', thisObj.genderVrf);
    }
  };

  genderVrf() {
    var gdr = $('input[name=gender]');
    var gdrMsg = $('#gdrMsg');      
    if ($('input[name=gender]:checked').length == 0) {
      isValid = wrapFunc.BasicValidation(
        false,
        gdrMsg,
        "Please select room gender.",
        gdr
      );
      return;
    } else {
      isValid = true;
      wrapFunc.MeetRequirement(
        gdr, 
        gdrMsg, 
        "Please select room gender."
      );
    }
  }  

  rppNumeric() {
    var thisObj = this;
    var eRppMsg = $('#rppMsg');
    var eRpp = $('#rates-per-person');    
    eRpp.val(eRpp.val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    var plainText = eRpp.val().trim();
    isValid = wrapFunc.BasicValidation(
      (plainText.length != 0),
      eRppMsg,
      "Please don't leave it empty.",
      eRpp
    );
    if (!isValid) {
      return;
    }
    isValid = wrapFunc.BasicValidation(
      (plainText.match(/^\d+(\.\d+)?$/)),
      eRppMsg,
      "Please key in valid amount.",
      eRpp
    );
    if (!isValid) {
      return;
    }      
    wrapFunc.MeetRequirement(
      eRpp,
      eRppMsg,
      "Please don't leave it empty."
    );

    if (decimalPlac(plainText) > 2) {
      eRpp.val(roundToTwo(eRpp.val()));
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

    function decimalPlac(num) {
      var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) { return 0; }
      return Math.max(
           0,
           // Number of digits right of decimal point.
           (match[1] ? match[1].length : 0)
           // Adjust for scientific notation.
           - (match[2] ? +match[2] : 0));
    }    
  }

  dpNumeric() {
    var thisObj = this;
    var eDpMsg = $('#dpMsg');
    var eDp = $('#deposit');   
    eDp.val(eDp.val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    var plainText = eDp.val().trim();
    isValid = wrapFunc.BasicValidation(
      (plainText.length != 0),
      eDpMsg,
      "Please don't leave it empty.",
      eDp
    );
    if (!isValid) {
      return;
    }
    isValid = wrapFunc.BasicValidation(
      (plainText.match(/^\d+(\.\d+)?$/)),
      eDpMsg,
      "Please key in valid amount.",
      eDp
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      eDp,
      eDpMsg,
      "Please don't leave it empty."
    );
    if (decimalPlac(plainText) > 2) {
      eDp.val(roundToTwo(eDp.val()));
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

    function decimalPlac(num) {
      var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) { return 0; }
      return Math.max(
           0,
           // Number of digits right of decimal point.
           (match[1] ? match[1].length : 0)
           // Adjust for scientific notation.
           - (match[2] ? +match[2] : 0));
    }
  }

  validFunc(func) {
    func;
    if (isValid) {
      return true;
    }
    return false;
  }

  vrfEditTor() {
    var eTorMsg = $('#torMsg');
    var eTor = $('#types-of-rooms');    
    isValid = wrapFunc.BasicValidation(
      $.trim(eTor.val()),
      eTorMsg,
      "Please don't leave it empty.",
      eTor
    );
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      eTor,
      eTorMsg,
      "Please don't leave it empty."
    );
  } 

  handleClose = (e) => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    thisObj.setState({
      btnDisabled: true,
    });
    var finalValidation = thisObj.validFunc(thisObj.vrfEditTor()) &
                          thisObj.validFunc(thisObj.dpNumeric()) &
                          thisObj.validFunc(thisObj.rppNumeric()) &
                          thisObj.validFunc(thisObj.genderVrf());

    if (!finalValidation) {
      thisObj.setState({
        btnDisabled: false,
      });      
      return;
    }

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
      userIsAdmin: userData.isAdmin,
      userCampus: userData.campus,
      userGender: userData.gender
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
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetRoomTypeDataSource(res.data);
          wrapFunc.PaginateRoomTypeContent(res.data);
        }
      }
    });
  }

  sortByLatest(a, b) {
    var av = a.TimeStamp;
    var bv = b.TimeStamp;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
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
      <div>
        <IconButton 
          id="add-room-type-btn"
          iconClassName="fa fa-plus"
          style={styles.button}
          onTouchTap={this.handleOpen}
          tooltip="Add"
          touch={true}
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
              <div id="torMsg">Please don't leave it empty.</div>
              <TextField
                id="deposit"
                name="deposit"
                floatingLabelText="Deposit"
                type="text"
                fullWidth={true}
              />
              <div id="dpMsg">Please don't leave it empty.</div>
              <TextField
                id="rates-per-person"
                name="rates-per-person"
                floatingLabelText="Rates Per Person"
                type="text"
                fullWidth={true}
              />
              <div id="rppMsg">Please don't leave it empty.</div>
              <br/>
              <Toggle
                id="twin"
                name="twin"
                label="Twin"
                defaultToggled={false}
                style={styles.toggle}
              />
              <p className="form-paragraph">Gender</p>
              <RadioButtonGroup name="gender">
                <RadioButton
                  value="male"
                  label="Male"
                />
                <RadioButton
                  value="female"
                  label="Female"
                />
              </RadioButtonGroup>
              <br/>
              <div id="gdrMsg">Please select room gender.</div>
              <br/>
            </div>
          </form>
        </Dialog>
      </div>
    );
  }
}
