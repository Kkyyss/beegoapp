import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';

var $ = window.Jquery;

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

export default class ForgotPasswordPage extends Component {

  componentDidMount() {
    var ajax = $.ajax;
    var wrapFunc = window.Wrapper;
    var isValid = false;
    var submitBtn = $('#forgot-password-btn');
    var userForm = $('form[name="forgotPassword"]');
    submitBtn.click(submitForgotPassword);

    wrapFunc.DisabledFormSubmitByEnterKeyDown(userForm);

    function submitForgotPassword(e) {
      e.preventDefault();
      var finalValidation = validFunc(forgotPwdEmailVrf());
      if (!finalValidation) {
        return;
      }
      ajax({
        url   : "/forgot_password",
        method  : "POST",
        data  : userForm.serialize(),
        cache: false,
        beforeSend: function() {
          wrapFunc.LockScreen(submitBtn, userForm, true);
        },
        success: function(res) {
          wrapFunc.LockScreen(submitBtn, userForm, false);
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
          wrapFunc.AlertStatus(
            'Complete Submitted', 
            'Thanks for the submission, please check your email to process password reset.',
            'success',
            false,
            false
          );  
          return;
        }
      });
      return; 
    }

    var forgotPwdEmail = $('input[name="user-email"]');
    var emailMsg = $('#emailMsg');
    forgotPwdEmail.bind({
      "input focusout": forgotPwdEmailVrf,
    });

    function forgotPwdEmailVrf() {
      var plainText = forgotPwdEmail.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/^.+@.+$/), 
        emailMsg,
        "Valid Email format 'example@.com'",
        forgotPwdEmail
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        forgotPwdEmail, 
        emailMsg, 
        "Valid Email format 'example@.com'"
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
        <Card id="card" name="forgot-password-card" style={styles.cardSize}>
          <div className="card-content">
            <CardTitle 
            title="Forgot Password" 
            subtitle="Reset password link will be send to the email that given."
            />
            <form name="forgotPassword">
              <TextField
                floatingLabelText="Email"
                fullWidth={true}
                id="user-email"
                name="user-email"
                type="email"
              />
              <div id="emailMsg">Valid Email format 'example@.com'</div>        
            </form>
            <br/>
            <CardActions>
              <RaisedButton
                style={styles.buttonPos}
                primary={true}
                label="Go!"
                id="forgot-password-btn"
                type="submit"
              />
              <div style={styles.clear}></div>
            </CardActions>
          </div>
        </Card>
      </div> 
    );
  }
} 

