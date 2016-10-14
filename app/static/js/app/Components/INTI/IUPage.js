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
};

export default class IUPage extends Component {
  constructor(props) {
    super(props);
  }

  openMap = (ev) => {
    ev.preventDefault();
    var url = 'https://www.google.com.my/maps/dir/INTI+International+University+hostel/Inti+International+University,+Jalan+BBN+12%2F1,+Bandar+Baru+Nilai,+71800+Nilai,+Negeri+Sembilan/@2.8116083,101.7561634,17z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x0:0x715d40e138e8866!2m2!1d101.7592707!2d2.8092893!1m5!1m1!1s0x31cdc6dc172c2901:0x36e15bc4efe6ea!2m2!1d101.7571702!2d2.813504!3e2?hl=en';
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
      viewRatesBox.width(windowWidth * 0.8);
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
            <img id="show-rates" />
          </div>
        </div>
        <div id="card-wrapper" style={styles.cardWrapper} className="wrapper-margin">
          <Card id="card" style={styles.cardSize}>
            <CardMedia
              overlay={
                <div style={styles.padding}>
                  <div>
                    <span className="inti-title whitify">INTI International University Nilai</span>
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
              <img src="../static/img/IU_campus.jpg" />
            </CardMedia>
            <div style={styles.contentPadding}>
              <CardTitle title="RENTAL RATES PER PERSON" />
              <CardMedia>
                <img id="rates-info" src="../static/img/iu-personal-rental-rates.png" />
              </CardMedia>
            </div>   
          </Card>
        </div>
      </div>
    );
  }
}
