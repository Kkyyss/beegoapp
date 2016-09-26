import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import {redA400, deepPurple900} from 'material-ui/styles/colors';

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
    // left: '15%',
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
  leftParagrah: {
    fontSize: '12px',
    float: 'left',
  },
  cardWrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentPadding: {
    paddingLeft: '30%',
    paddingRight: '30%',
    paddingBottom: '15px',
  },
  tabStyle: {
    backgroundColor: deepPurple900,
  },
  tabInkBarStyle: {
    backgroundColor: redA400,
  },
  textRed: {
    color: 'red',
  },
  button: {
    margin: '6px 0 12px 0',
  }
};

export default class LoginRegisterPage extends Component {

  componentDidMount() {
    // $('#log-gplus, #reg-gplus, #log-facebook, #reg-facebook').on('click', providerRequest);

    // function providerRequest() {
    //   var idName = $(this).attr('name');
    //   $(location).attr('href', "/auth/"+ idName + "?provider=" + idName);
    // }
    
    var ajax = $.ajax;
    var wrapFunc = window.Wrapper;
    // Login
    var logBtn = $('#log-submit-btn');
    var logEmail = $('#log-email');
    var logPwd = $('#log-password');
    var logForm = $('form[name="login"]');
    logBtn.click(submitLogin);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(logForm);

    function submitLogin(ev) {
      ev.preventDefault();
      if ( !logEmail.val().trim() || !logPwd.val().trim() ) {
        wrapFunc.AlertStatus(
          'Empty',
          "Please don't leave input field empty!",
          'error',
          true,
          true
        );
        return;
      }
      ajax({
        url     : "/login",
        method  : "POST",
        data    : logForm.serialize(),
        cache: false,
        beforeSend: function() {
          wrapFunc.LockScreen(logBtn, logForm, true);
        },
        success: function(res) {
          if (res.capres) {
            wrapFunc.ResetCap(LogRecap);
            wrapFunc.LockScreen(logBtn, logForm, false);
            wrapFunc.AlertStatus(
              'Oops...',
              res.capres,
              'error',
              false,
              false
            );
            return;
          } else if (res.error) {
            if (res.excceed != null && $('#log-recap').css('display') === 'none') {
              $('#log-recap').removeClass('hide').addClass('show');
            }
            wrapFunc.ResetCap(LogRecap);
            wrapFunc.LockScreen(logBtn, logForm, false);
            wrapFunc.AlertStatus(
              'Oops...',
              res.error,
              'error',
              false,
              false
            );
            return;
          }
          $(location).attr('href', "/user");
        }
      });
      return;
    }

    // Register
    var isValid = false;
    var regBtn = $('#reg-submit-btn');
    var regForm = $('form[name="register"]');
    regBtn.click(submitRegister);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(regForm);

    function submitRegister(ev) {
      ev.preventDefault();
      var finalValidation = validFunc(regEmailVrf()) &
               validFunc(regPasswordVrf()) &
               validFunc(regNameVrf());
               // & validFunc(phoneVrf());
      if (!finalValidation) {
        return false;
      }

      ajax({
        url   : "/register",
        method  : "POST",
        data  : regForm.serialize(),
        cache: false,
        beforeSend: function() {
          wrapFunc.LockScreen(regBtn, regForm, true);
        },
        success: function(res) {
          if (res == null) {
            wrapFunc.LockScreen(regBtn, regForm, false);
            swal({
                title: 'Success Registration',
                text: 
                  'Thank you for the registration, please check your Email to process account activation!',
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonText: 'No, I didn\'t received any email',
                cancelButtonText: 'Cancel',
                showLoaderOnConfirm: true,
                preConfirm: function(email) {
                  return new Promise(function(resolve, reject) {
                    ajax({
                      url: "/resend_activation_mail",
                      method : "POST",
                      data : regForm.serialize(),
                      cache: false,
                      success: function(res) {
                        if (!res) {
                          reject();
                        } else {
                          reject(res);
                        }
                      }
                    });
                  });
                }
            }).then(function() {
            }, function(dismiss) {
              if (dismiss === 'cancel') {
                $(location).attr('href', "/login_register");
              }
            });
          } else {
            // Sweet alert2
            var errText;

            if (res.name != null && res.email == null && res.password == null) {
              errText = res.name;
            } else if (res.name != null && res.email != null && res.password == null) {
              errText = res.name + ' and ' + res.email + '.';
            } else if (res.name == null && res.email != null && res.password == null) {
              errText = res.email;
            } else if (res.name == null && res.email != null && res.password != null) {
              errText = res.email + ' and ' + res.password + '.';
            } else if (res.name == null && res.email == null && res.password != null) {
              errText = res.password;
            } else if (res.name != null && res.email == null && res.password != null) {
              errText = res.name + ' and ' + res.password + '.';
            } else {
              errText = res;
            }
            wrapFunc.ResetCap(RegRecap);
            wrapFunc.LockScreen(regBtn, regForm, false);
            wrapFunc.AlertStatus(
              'Oops...',
              errText,
              'warning',
              false,
              false
            );  
            return;
          }
        }
      });
      return;
    }
    /*
      @Usage: client-side full name validation
    */
    var regName = $('input[name="reg-username"]');
    var userMsg = $('#userMsg');
    regName.on({
      'input focusout': regNameVrf,
    })

    function regNameVrf() {
      var plainText = regName.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/^[a-zA-Z\s]{1,}$/),
        userMsg,
        "Please don't leave it empty.",
        regName
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        regName, 
        userMsg, 
        "Please don't leave it empty."
      );
    }

    /*
      @Usage: client-side email validation
    */
    var regEmail = $('input[name="reg-email"]');
    var emailMsg = $('#emailMsg');
    regEmail.on({
      "input focusout": regEmailVrf,
    });

    function regEmailVrf() {
      var plainText = regEmail.val().trim();
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/^.+@.+$/), 
        emailMsg,
        "Valid Email format 'example@.com'",
        regEmail
      );
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        regEmail, 
        emailMsg, 
        "Valid Email format 'example@.com'"
      );  
    }

    /*
      @Usage: client-side password validation
    */
    var regPassword = $('input[name="reg-password"]');
    var pwdMsg = $('#pwdMsg');
    regPassword.bind({
      "input focusout": regPasswordVrf, 
    });

    function regPasswordVrf() {
      var plainText = regPassword.val().trim(); 
      isValid = wrapFunc.BasicValidation(
        (plainText).match(/[\S]{8,}/g),
        pwdMsg,
        "Use at least 8 characters (spacing is not counted).",
        regPassword
      )
      if (!isValid) {
        return;
      }
      wrapFunc.MeetRequirement(
        regPassword, 
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
        <Card id="card" name="login-register-card" style={styles.cardSize}>
          <Tabs
            inkBarStyle={styles.tabInkBarStyle}
          >
            <Tab 
              style={styles.tabStyle}
              icon={<FontIcon className="fa fa-sign-in" />}
              label="Log In"
            >
              <div className="card-content" style={styles.contentPadding} >
                <CardTitle title="Login" subtitle="Welcome back." />
                  <RaisedButton
                    id="reg-gplus"
                    name="gplus"                  
                    label="Login With Student Mail"
                    fullWidth={true}
                    labelColor="white"
                    style={styles.button}
                    backgroundColor="#d34836"
                    icon={<FontIcon className="fa fa-google-plus-official whitify" />}
                  />
                  <h3 style={styles.textCenter}>OR</h3>
                  <form name="login">
                    <TextField
                      floatingLabelText="Email"
                      fullWidth={true}
                      id="log-email"
                      name="log-email"
                      type="email"
                    />
                    <TextField
                      floatingLabelText="Password"
                      fullWidth={true}
                      id="log-password"
                      name="log-password"
                      type="password"
                    />
                    <br/><br/>
                    <div id="log-recap"></div>
                    <br/>
                    <p>
                    <a href="/forgot_password" style={styles.paragraphStyle}>Forgot password?</a>
                    </p>
                    <Divider/>
                  </form>
                <br/>
                <CardActions>
                  <RaisedButton
                    fullWidth={true}
                    primary={true}
                    label="Go!"
                    id="log-submit-btn"
                  />
                </CardActions>
              </div>
            </Tab>
            <Tab 
              style={styles.tabStyle}        
              icon={<FontIcon className="fa fa-user-plus" />}
              label="Sign Up"
            >
              <div className="card-content" style={styles.contentPadding}>
                <CardTitle title="Sign up" subtitle="Join us and start book!" />
                  <RaisedButton
                    id="reg-gplus"
                    name="gplus"                  
                    label="Login With Student Mail"
                    fullWidth={true}
                    labelColor="white"
                    style={styles.button}
                    backgroundColor="#d34836"
                    icon={<FontIcon className="fa fa-google-plus-official whitify" />}
                  />
                  <h3 style={styles.textCenter}>OR</h3>
                 <form name="register">
                  <TextField
                    floatingLabelText="Full Name"
                    fullWidth={true}
                    id="reg-username"
                    name="reg-username"
                    type="text"
                  />
                  <div id="userMsg">Please don't leave it empty.</div>
                  <TextField
                    floatingLabelText="Email"
                    fullWidth={true}
                    id="reg-email"
                    name="reg-email"
                    type="email"
                  />
                  <div id="emailMsg">Valid Email format 'example@.com'</div>
                  <TextField
                    floatingLabelText="Password"
                    fullWidth={true}
                    id="reg-password"
                    name="reg-password"
                    type="password"
                  />
                  <div id="pwdMsg">Use at least 8 characters (spacing is not counted).</div>
                  <br/>
                  <div id="reg-recap"></div>
                  <br/>
                  <p style={styles.paragraphStyle}>
                  By clicking Go! now, you agree to AKGO's <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and <a href="">Cookie Policy</a>.
                  </p>
                </form>
                <br/>
                <Divider />
                <CardActions>
                  <RaisedButton
                    fullWidth={true}
                    primary={true}
                    label="Go!"
                    id="reg-submit-btn"
                  />
                </CardActions>
              </div>  
            </Tab>
          </Tabs>     
        </Card>
      </div>
    );
  }
}
