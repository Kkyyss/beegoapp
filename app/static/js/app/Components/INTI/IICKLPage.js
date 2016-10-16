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

export default class IICKLPage extends Component {
  constructor(props) {
    super(props);
  }

  openMap = (ev) => {
    ev.preventDefault();
    var url = 'https://www.google.com.my/maps/dir/Titiwangsa+Sentral+Condominium+Jalan+Cemur+Damai+33+Kuala+Lumpur+Federal+Territory+of+Kuala+Lumpur/INTI+International+College+Kuala+Lumpur,+Ground+Floor+Menara+KH,+Jalan+Sultan+Ismail,+Kuala+Lumpur,+50250+Kuala+Lumpur,+Federal+Territory+of+Kuala+Lumpur/@3.1615902,101.6912067,15z/data=!4m13!4m12!1m5!1m1!1s0x31cc48180ab11f39:0x533c85f87de5f037!2m2!1d101.6968345!2d3.1711968!1m5!1m1!1s0x31cc37d4d48dbb57:0x5c888e778d5695e5!2m2!1d101.7098837!2d3.1511337?hl=en';
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
                    <span className="inti-title whitify">INTI INTERNATIONAL COLLEGE KUALA LUMPUR</span>
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
              <img src="../static/img/IICKL_campus.jpg" />
            </CardMedia>
            <div style={styles.contentPadding}>
              <CardTitle title="RENTAL RATES PER PERSON" />
              
              <CardMedia>
                <img id="rates-info" src="../static/img/iickl-personal-rental-rates.jpg" />
              </CardMedia>
              
            </div>   
          </Card>
        </div>
      </div>
    );
  }
}
