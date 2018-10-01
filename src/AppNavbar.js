import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact';
import * as storage from './storage';

class AppNavbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick () {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render () {
    const bgPink = {backgroundColor: '#ec407a'};

    let authLink;
    if (storage.local.getItem('githubToken') === null) {
      authLink = <NavLink to="/auth">Add Access Token</NavLink>;
    } else {
      authLink = <NavLink to="/auth">Remove Access Token</NavLink>;
    }

    return (
      <Navbar style={bgPink} dark expand="md" scrolling fixed="top">
        <NavbarBrand href="/">
          <strong>Github PR Viewer</strong>
        </NavbarBrand>
        <NavbarToggler onClick={this.onClick}/>
        <Collapse isOpen={this.state.collapse} navbar>
          <NavbarNav left>
            <NavItem>
              <NavLink to="/repos">Select Repositories</NavLink>
            </NavItem>
          </NavbarNav>
          <NavbarNav right>
            <NavItem>{authLink}</NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
    );
  }
}

export default AppNavbar;