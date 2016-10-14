import React, {Component} from 'react';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

var $ = window.Jquery;

const styles = {
  cardSize: {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '15%',
    width: '70%',
  },
  cardWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  contentPadding: {
    padding: '15px',
  },
  balance: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  right: {
    float: 'right',
    margin: '0 10px 10px 0',
  },
  clearFix: {
    clear: 'both',
  },
  padding: {
    paddingLeft: 10,
  },
  nestedCardSize: {
    width: '100%',
    padding: '15px',
  },
  textCenter: {
    textAlign: 'center',
  },
};

export default class UserDownloadsPage extends Component {
  constructor(props) {
    super(props);
  }

  downloadAccommodation = (event, type) => {
    event.preventDefault();
    _gaq.push(['_trackEvent', 'Download', 'Accommodation', type]);
    var req = new XMLHttpRequest();
    req.open("GET", "/static/download/Accommodation." + type, true);
    req.responseType = "blob";

    req.onload = function (e) {
      var blob = req.response;
      var link=document.createElement('a');
      link.href=window.URL.createObjectURL(blob);
      link.download="Accommodation." + type;
      link.click();
    };

    req.send();
    // window.open("/static/download/Accommodation.7z");
  };

  acSevenz = (event) => {
    this.downloadAccommodation(event, '7z');
  };

  acRar = (event) => {
    this.downloadAccommodation(event, 'rar');
  };

  acZip = (event) => {
    this.downloadAccommodation(event, 'zip');
  };

  acPdf = (event) => {
    this.downloadAccommodation(event, 'pdf');
  };

  render() {
    return (
      <div>
        <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <CardMedia
              overlay={
                <div style={styles.padding}>
                  <div>
                    <span className="inti-title whitify">Download Latest Accommodation Details</span>
                  </div>
                </div>
              }
            >
              <img src="../static/img/Download_Theme.jpg" />
            </CardMedia>
            <div style={styles.contentPadding}>
              <CardTitle title="Available file types" />
              <div className="block-center">
              <CardMedia className="half-wide">
                <List>
                  <ListItem
                    primaryText={<b style={styles.textCenter}>.7z&nbsp;</b>}
                    secondaryText={<small><b>(2.61mb)</b></small>}
                    onTouchTap={this.acSevenz}
                  />
                  <Divider />
                  <ListItem
                    primaryText={<b style={styles.textCenter}>.rar&nbsp;</b>}
                    secondaryText={<small><b>(2.62mb)</b></small>}
                    onTouchTap={this.acRar}
                  />
                  <Divider />
                  <ListItem
                    primaryText={<b style={styles.textCenter}>.zip&nbsp;</b>}
                    secondaryText={<small><b>(2.75mb)</b></small>}
                    onTouchTap={this.acZip}
                  />
                  <Divider />
                  <ListItem
                    primaryText={<b style={styles.textCenter}>.pdf&nbsp;</b>}
                    secondaryText={<small><b>(3.89mb)</b></small>}
                    onTouchTap={this.acPdf}
                  />
                </List>
              </CardMedia>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
