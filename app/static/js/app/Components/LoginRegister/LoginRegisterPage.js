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
    var logForm = $('form[name="login"]');
    logBtn.click(submitLogin);
    wrapFunc.DisabledFormSubmitByEnterKeyDown(logForm);

    function submitLogin(ev) {
      ev.preventDefault();
      if ( !logEmail.val().trim() ) {
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
          wrapFunc.LockScreen(logBtn, logForm, false);
          if (res.length != 0) {
            wrapFunc.AlertStatus(
              'Oops...',
              res,
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
                  <form name="login">
                    <TextField
                      floatingLabelText="Email"
                      fullWidth={true}
                      id="log-email"
                      name="log-email"
                      type="email"
                    />
                    <br/><br/>
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
          </Tabs>     
        </Card>
      </div>
    );
  }
}
