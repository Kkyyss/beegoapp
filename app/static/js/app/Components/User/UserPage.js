import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';

var $ = window.Jquery;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }, 
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
    paddingLeft: '25%',
    paddingRight: '25%',
  },
  gridList: {
    marginTop: 24,
    width: '80%',
    height: '100%',
    marginBottom: 24,
  },
  button: {
    marginRight: 12,
  },
  gridTile: {
    boxShadow: '10px 10px 5px #888888',
  },
};

const tilesData = [
  {
    img: '../static/img/IU_campus.jpg',
    title: 'INTI International University Nilai',
    link: '/user/inti-iu',
  },
  {
    img: '../static/img/IICS_campus.jpg',
    title: 'INTI International College Subang',
    link: '/user/inti-iics',
  },
  {
    img: '../static/img/IICKL_campus.jpg',
    title: 'INTI International College Kuala Lumpur',
    link: '/user/inti-iickl',
  },
  {
    img: '../static/img/IICP_campus.jpg',
    title: 'INTI International College Penang',
    link: '/user/inti-iicp',
  },
  {
    img: '../static/img/ICS_campus.jpg',
    title: 'INTI College Sabah',
    link: '/user/inti-ics',
  },    
];

export default class UserPage extends Component {
  componentDidMount() {
    document.cookie = '_gothic_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  render() {
    return (
      <div>
        <div id="card-wrapper" style={styles.cardWrapper}>

          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={150}
              padding={20}
              style={styles.gridList}
            >
              <Subheader>Available Campuses</Subheader>
              {tilesData.map((tile) => (
                <GridTile
                  key={tile.img}
                  title={tile.title}
                  actionIcon={
                    <RaisedButton
                      label="Go"
                      primary={true}
                      style={styles.button}
                      href={tile.link}
                    />
                  }
                  titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  cols={1}
                  rows={2}
                  style={styles.gridTile}
                >
                  <img src={tile.img} />
                </GridTile>
              ))}            
            </GridList>
          </div>
        </div>
      </div>
    );
  }
}
