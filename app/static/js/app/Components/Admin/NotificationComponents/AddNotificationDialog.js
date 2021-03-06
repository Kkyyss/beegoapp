import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

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

export default class AddNotificationDialog extends Component {
  state = {
    open: false,
    value: "IU",
    disabled: false,
    btnDisabled: false,
  };

  handleChange = (event, index, value) => {
    this.changeCampus(value);
  };

  handleOpen = (e) => {
    var thisObj = this;
    this.setState({open: true}, afterOpened);

    function afterOpened(){
      var nfTitle = $('#nf-title');
      nfTitle.on("input focusout", thisObj.vrfTitle);

      var nfMessage = $('#nf-message');
      nfMessage.on("input focusout", thisObj.vrfMessage);
    }
  };

  vrfTitle() {
    var nfTitleMsg = $('#nfTitleMsg');
    var nfTitle = $('#nf-title');
    isValid = wrapFunc.BasicValidation(
      $.trim(nfTitle.val()),
      nfTitleMsg,
      "Please don't leave it empty.",
      nfTitle
    );
    console.log(isValid);
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      nfTitle,
      nfTitleMsg,
      "Please don't leave it empty."
    );
  }

  vrfMessage() {
    var nfmsgMsg = $('#nfmsgMsg');
    var nfMessage = $('#nf-message');
    isValid = wrapFunc.BasicValidation(
      $.trim(nfMessage.val()),
      nfmsgMsg,
      "Please don't leave it empty.",
      nfMessage
    );
    console.log(isValid);
    if (!isValid) {
      return;
    }
    wrapFunc.MeetRequirement(
      nfMessage,
      nfmsgMsg,
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

  handleClose = (e) => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var thisObj = this;
    thisObj.setState({
      btnDisabled: true,
    });

    var finalValidation = thisObj.validFunc(thisObj.vrfTitle()) &
                          thisObj.validFunc(thisObj.vrfMessage());

    if (!finalValidation) {
      thisObj.setState({
        btnDisabled: false,
      });      
      return;
    }

    $('#nf-campus').val(thisObj.state.value);
    console.log($('#nf-campus').val());
    var addnfForm = $('#add-nf-form');
    ajax({
      url: "/user/notification-console",
      method: "POST",
      data: addnfForm.serialize(),
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
          thisObj.getNotificationList();
          wrapFunc.AlertStatus('Success', 'Admin Added Successfully!', 'success', true, true);
        }
        thisObj.setState({
          btnDisabled: false,
        });        
        return;
      }
    });    
  };

  getNotificationList() {
    var thisObj = this;

    var userState = {
      userCampus: userData.campus
    };

    ajax({
      url: "/api/view-notification-list",
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
          console.log(res.data);
          res.data.sort(thisObj.sortByLatest);
          wrapFunc.SetNotificationDataSource(res.data);
          wrapFunc.PaginateNotificationContent(res.data);
        }
      }
    });
  }

  sortByLatest(a, b) {
    var av = a.DateReceive;
    var bv = b.DateReceive;
    return ((av > bv) ? -1 : ((av < bv) ? 1 : 0));
  }  

  changeCampus(value) {
    this.setState({value});
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
        onClick={this.handleSubmit}
        disabled={this.state.btnDisabled}
      />,
    ];

    return (
      <div>
          <IconButton
            id="add-nf-btn"
            iconClassName="fa fa-plus"
            style={styles.button}
            onTouchTap={this.handleOpen}
          />
          <Dialog
            title="Add Notification"
            className="add-nf-dialog"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <form id="add-nf-form" style={styles.formStyle} className="add-nf-style">
              <div>Campus&nbsp;
              <DropDownMenu id="campusDropDown" value={this.state.value} onChange={this.handleChange} disabled={this.state.disabled}>
                <MenuItem value={"ALL"} primaryText="ALL" />
                <MenuItem value={"IU"} primaryText="IU" />
                <MenuItem value={"IICS"} primaryText="IICS" />
                <MenuItem value={"IICKL"} primaryText="IICKL" />
                <MenuItem value={"IICP"} primaryText="IICP" />
              </DropDownMenu>
              <input id="nf-campus" name="nf-campus" type="text" style={styles.hide} />
              <TextField
                id="nf-title"
                name="nf-title"
                floatingLabelText="Title"
                type="text"
                fullWidth={true}
              />
              <div id="nfTitleMsg">Please don't leave it empty.</div>
              <TextField
                id="nf-message"
                name="nf-message"
                floatingLabelText="Message"
                multiLine={true}
                fullWidth={true}
                rowsMax={4}
                rows={2}
              />
              <div id="nfmsgMsg">Please don't leave it empty.</div>
              </div>
            </form>
          </Dialog>
      </div>
    );
  }
}
