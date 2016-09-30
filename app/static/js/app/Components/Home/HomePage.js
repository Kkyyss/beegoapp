import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';

var $ = window.Jquery;

const styles = {
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '15%',
    width: '70%',
    height: '400px',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textCenter: {
    textAlign: 'center',
  },
  contentStyle: {
    padding:'25px',
  },
  titleStyle: {
    color: 'white',
    textAlign: 'center',
  },
  hide: {
    display: 'none',
  },
  logoStyle: {
    padding: '25px',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: '15px',
  },
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  // accessLoginRegister = (event) => {
  //   this.redirectUrl(event, "/login_register");
  // };

  // redirectUrl = (event, url) => {
  //   event.preventDefault();
  //   $(location).attr('href', url);
  // }

  componentDidMount() {
    $('.tlt').textillate('stop');
    $('.tlt').textillate({
      loop: true,
      // in animation settings
      in: {
        // set the effect name
        effect: 'fadeIn',

        // set the delay factor applied to each consecutive character
        delayScale: 2.5,

        // set the delay between each character
        delay: 50,

        // set to true to animate all the characters at the same time
        sync: false,

        // randomize the character sequence 
        // (note that shuffle doesn't make sense with sync = true)
        shuffle: false,

        // reverse the character sequence 
        // (note that reverse doesn't make sense with sync = true)
        reverse: false,

        // callback that executes once the animation has finished
        callback: function () {}
      },      
      out: {
        effect: 'fadeOut',
        delayScale: 0.5,
        delay: 50,
        sync: false,
        shuffle: false,
        reverse: true,
        callback: function () {}
      },
      // type: 'word',
    });

    $('.tlt').textillate('start');
  }

  render() {
    return (
      <div>
        <div id="card-wrapper" className="wrapper-margin home-page">
          <Card id="card" style={styles.cardSize}>
            <div id="content" style={styles.contentStyle}>
              <div style={styles.textCenter}>
                <img className="intiLogo" style={styles.logoStyle} src="../static/img/inti_international_logo.png" />
              </div>
              <h1 style={styles.titleStyle} className="tlt">
                <ul className="texts" style={styles.hide}>
                  <li>Welcome to IHMS</li>
                  <li>IHMS is a system that purposed for student to do online hostel booking.</li>
                </ul>
              </h1>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
