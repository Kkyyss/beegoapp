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

export default class IICPPage extends Component {
  constructor(props) {
    super(props);
  }

  openMap = (ev) => {
    ev.preventDefault();
    var url = "https://www.google.com.my/maps/dir/D'piazza+Condominium,+Bayan+Lepas,+Penang/INTI+International+College+Penang,+Z,+1,+Lebuh+Bukit+Jambul,+Bukit+Jambul,+11900+Bayan+Lepas,+Pulau+Pinang/1-World+Tingkat+Mahsuri+2+Bayan+Lepas+Penang/Elite+Height+Bayan+Lepas+Penang/@5.3313947,100.2733755,15z/data=!3m1!4b1!4m26!4m25!1m5!1m1!1s0x304ac06b2f229031:0x974007d6239e34ab!2m2!1d100.2834125!2d5.3252832!1m5!1m1!1s0x304ac048a161f277:0x881c46d428b3162c!2m2!1d100.2824494!2d5.3412116!1m5!1m1!1s0x304ac04025c41dab:0x148e17ed2fef4815!2m2!1d100.2844389!2d5.3287889!1m5!1m1!1s0x304ac06c99e5d49d:0x678ba84f4431c5bd!2m2!1d100.284552!2d5.3226064!3e0?hl=en";
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
                    <span className="inti-title whitify">INTI INTERNATIONAL COLLEGE PENANG</span>
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
              <img src="../static/img/IICP_campus.jpg" />
            </CardMedia>
            <div style={styles.contentPadding}>
              <CardTitle title="RENTAL RATES PER PERSON" />
              
              <CardMedia>
                <img id="rates-info" src="../static/img/iicp-personal-rental-rates.jpg" />
              </CardMedia>
              
            </div>   
          </Card>
        </div>
      </div>
    );
  }
}
