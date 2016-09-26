import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {ListItem} from 'material-ui/List';
import {redA700} from 'material-ui/styles/colors';

const styles = {
	footer: {
    position:'fixed',
	  left:'0px',
	  bottom:'0px',
 	  width: '100%',
    backgroundColor: redA700,
	},
	center: {
	  textAlign: 'center',
	},
  hide: {
    display: 'none',
  },
  marginTopCover: {
    marginTop: '16px',    
  },
  link: {
    textDecoration: 'none',
    marginLeft: '10%',
    fontSize: '30px',
    color: 'white',
  },
  sidebarTitle: {
    height: 64,
    width: 250,
    display: 'inline-block',
    backgroundColor: redA700,
  },
};

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    return (
      <div>
      <Drawer
        containerClassName="right-drawer-scrollbar"
        docked={false}
        width={250}
        openSecondary={true}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
      >
        <Paper
          style={styles.sidebarTitle}
          zDepth={1}
        >
          <div style={styles.marginTopCover }>
            <span style={styles.link}>INFO</span>
          </div>
        </Paper>
        <ListItem
          primaryText="Agreement & Policy"
          primaryTogglesNestedList={true}
          nestedItems = {[
            <ListItem
              key={1}
              primaryText="User Agreement"
              href=""
              onTouchTap={this.handleClose}
            />,
            <ListItem
              key={2}
              primaryText="Privacy Policy"
              href=""
              onTouchTap={this.handleClose}
            />,
            <ListItem
              key={3}
              primaryText="Cookie Policy"
              href=""
              onTouchTap={this.handleClose}
            />,            
          ]}
        />        
      </Drawer>
      <Paper id="footer" zDepth={1} style={styles.footer}>
        <div style={styles.center}>
          <IconButton
            touch={true}
            iconClassName="fa fa-info-circle text-default"
            onTouchTap={this.handleToggle}
          />
        </div>
      </Paper>
      </div>
    );
  }
}
