import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

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

export default class IICSPage extends Component {
  constructor(props) {
    super(props);
  }

  openMap = (ev) => {
    ev.preventDefault();
    var url = 'https://www.google.com.my/maps/dir/My+Place+Apartment+Subang+Jaya+Selangor/INTI+International+College+Subang,+3,+Jalan+SS+15%2F8,+Ss+15,+47500+Subang+Jaya,+Selangor/The+Purple+House+Jalan+SS+15%2F8a+Ss+15+Subang+Jaya+Selangor/Subang+Avenue+Subang+Jaya+Selangor/@3.077656,101.588802,16.25z/data=!4m26!4m25!1m5!1m1!1s0x31cc4c5f0dd081c5:0x9f668af51fcf4568!2m2!1d101.5896946!2d3.0754631!1m5!1m1!1s0x31cc4c5f8bdfaba7:0x31aac7ab1af0abc!2m2!1d101.5909564!2d3.0741922!1m5!1m1!1s0x31cc4c5f622fb097:0x62e9f2196b9a472d!2m2!1d101.5891542!2d3.0740941!1m5!1m1!1s0x31cc4c5cc3af678b:0x8ca8500b6af57a99!2m2!1d101.5891171!2d3.0828809!3e2?hl=en';
    window.open(url, '_blank');
  }

  componentDidMount() {
    $(window).resize(function() {
      $(window).trigger("window:resize");
    });

    viewRates();

    $(window).on('window:resize', viewRates);

    function viewRates() {
      var windowHeight = $(window).height();
      var viewRatesBox = $('#rates-box');
      var windowWidth = $(window).width();
      viewRatesBox.width(windowWidth * 0.85);
      viewRatesBox.height(windowHeight * 0.8);
      var dialogContentHeight = viewRatesBox.height() - 38;
      $('.full-content').height(dialogContentHeight);
    }

    var dialogCollection = $('#bg-overlay, #rates-box');

    $('#rates-info').on('click', function() {
      $('#show-rates').attr('src', $(this).attr('src'));
      dialogCollection.css('display', 'block');
    });

    $('#bg-overlay, .cancel-btn').on('click', function() {
      dialogCollection.css('display', 'none');
    });

    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        dialogCollection.css('display', 'none');
      }
    });
  }

  render() {
    return (
      <div>
        <div id="bg-overlay"></div>
        <div id="rates-box">
          <div className="full-header">
          <RaisedButton
            className="cancel-btn"
            secondary={true}
            label="Cancel"
            fullWidth={true}
          />
          </div>
          <div className="full-content">
            <div style={styles.textCenter}>
              <img id="show-rates" />
            </div>
          </div>
        </div>
        <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <CardMedia
              overlay={
                <div style={styles.padding}>
                  <div>
                    <span className="inti-title whitify">INTI INTERNATIONAL COLLEGE SUBANG</span>
                      <RaisedButton
                        className="inti-title"
                        label="Map"
                        style={styles.right}
                        secondary={true}
                        onTouchTap={this.openMap}
                        icon={<FontIcon className="fa fa-map-marker whitify"/>}
                      />
                  </div>
                  <div style={styles.clearFix}></div>
                </div>
              }
            >
              <img src="../static/img/IICS_campus.jpg" />
            </CardMedia>
            <div style={styles.contentPadding}>
              <CardTitle title="RENTAL RATES PER PERSON" />
              
              <CardMedia>
                <img id="rates-info" src="../static/img/iics-personal-rental-rates.jpg" />
              </CardMedia>
              
            </div>   
          </Card>
        </div>
      </div>
    );
  }
}
