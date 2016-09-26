import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';

var $ = window.Jquery;
var swal = window.SweetAlert;

const styles = {
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  hide: {
    display: 'none',
  },
  clear: {
    clear: 'both',
  },
  buttonPos: {
    float: 'right',
  },
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',    
    paddingLeft: '15%',
    paddingRight: '15%',
    marginLeft: '15%',
    width: '70%',
  },
  textCenter: {
    textAlign: 'center',
  },
  paragraphStyle: {
    fontSize: '12px',
    textAlign: 'center',
  },
  cardWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#FAFAFA',
  },  
};

export default class ResetPasswordPage extends Component {

  componentDidMount() {
    var ajax = $.ajax;
    var wrapFunc = window.Wrapper;
    var isValid = false;
    var resetPwdBtn = $('#reset-password-btn');
    var resetPwdForm = $('form[name="ResetPassword"]');
    resetPwdBtn.click(submitResetPassword);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(resetPwdForm);

    function submitResetPassword() {
      var finalValidation = validFunc(resetPwdVrf());

      if (!finalValidation) {
        return false;
      }

      ajax({
        url   : $(location).attr('pathname'),
        method  : "POST",
        data  : resetPwdForm.serialize(),
        cache: false,
        beforeSend: function() {
          wrapFunc.LockScreen(resetPwdBtn, resetPwdForm, true);
        },
        success: function(res) {
          wrapFunc.LockScreen(resetPwdBtn, resetPwdForm, false);
          if (res) {
            wrapFunc.AlertStatus(
              'Oops...',
              res,
              'error',
              false,
              false
            );
            return;
          }
          swal({
            title: 'Complete Changed',
              text: 
                'Thanks for the submission, your password has been successfully changed.',
              type: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
          }).then(function () {
            $(location).attr('href', '/login_register');
          }).done();
          return;     
        }
      });
      return;
    }

    var resetPwd = $('input[name="user-password"]');
    var pwdMsg = $('#pwdMsg');
    resetPwd.bind({
      "input focusout": resetPwdVrf,  
    });

    function resetPwdVrf() {
      var plainText = resetPwd.val().trim(); 
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/[\S]{8,}/g),
        pwdMsg,
        "Use at least 8 characters (spacing is not counted).",
        resetPwd
      )
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        resetPwd, 
        pwdMsg, 
        "Use at least 8 characters (spacing is not counted)."
      );
    }

    function validFunc(func) {
     func;
     if (isValid) {
       return true;
     }
     return false;
    }

    this.forceUpdate();
  }

  render() {
    return (
      <div id="card-wrapper" style={styles.cardWrapper}>
        <Card id="card" name="reset-password-card" style={styles.cardSize}>
          <CardTitle 
          title="Reset Password" 
          subtitle="Once valid password was submitted successfully, database will be updated."
          />
          <form name="ResetPassword">
              <TextField
                hintText="Password"
                fullWidth={true}
                id="user-password"
                name="user-password"
                type="password"
              />
              <div id="pwdMsg">Use at least 8 characters (spacing is not counted).</div>
          </form>
          <br/>
          <CardActions>
            <RaisedButton
              style={styles.buttonPos}
              primary={true}
              label="Go!"
              id="reset-password-btn"
            />
            <div style={styles.clear}></div>
          </CardActions>        
        </Card>
      </div>
    );
  }
}
