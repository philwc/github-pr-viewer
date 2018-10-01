import React from 'react';
import { Card, CardBody, CardTitle, CardText, Input, Button } from 'mdbreact';
import * as storage from '../storage';
import { Redirect } from 'react-router-dom';

class Auth extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      token: '',
      savedToken: storage.local.getItem('githubToken'),
      redirect: false
    };
  }

  saveToken (e) {
    e.preventDefault();
    storage.local.setItem('githubToken', this.state.token);
    this.props.authCallback();
    this.redirect(e);
  }

  removeToken (e) {
    e.preventDefault();
    storage.local.removeItem('githubToken');
    this.props.authCallback();
    this.redirect(e);
  }

  handleChange (e) {
    this.setState({token: e.target.value});
  }

  redirect (e) {
    e.preventDefault();
    this.setState({redirect: true});
  }

  render () {

    const {redirect, savedToken} = this.state;

    let authCard = <Card>
      <CardBody>
        <CardTitle>Authentication Required</CardTitle>
        <CardText>
          In order to make requests to Github, a personal access token is required.
          To generate, <a
          href='https://github.com/settings/tokens/new?scopes=repo&description=Github%20PR%20Viewer'
          target="_blank" rel="noopener noreferrer">click here</a>. Once generated, copy/paste the token below &
          click save.
        </CardText>
        <Input value={this.state.token} onChange={this.handleChange.bind(this)}
               label="Github Personal Access Token"/>
        <Button onClick={this.saveToken.bind(this)} className='pull-right'>Save</Button>
      </CardBody>
    </Card>;

    let removeAuthCard = <Card>
      <CardBody>
        <CardTitle>Remove Token</CardTitle>
        <CardText>
          If you remove your access token, the application will not be able to make requests to Github. Are you sure?
        </CardText>
        <Button color='danger' onClick={this.removeToken.bind(this)} className='danger pull-right'>Remove</Button>
        <Button onClick={this.redirect.bind(this)} className='pull-right'>Cancel</Button>
      </CardBody>
    </Card>;

    let redirectDo = <Redirect to="/"/>;

    let out;
    if (redirect) {
      out = redirectDo;
    } else if (savedToken !== null) {
      out = removeAuthCard;
    } else {
      out = authCard;
    }

    return (out);
  }
}

export default Auth;