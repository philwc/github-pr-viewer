import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import GithubRepoList from './Github/GithubRepoList';
import Octokit from './Octokit';
import Auth from './Github/Auth';
import Repos from './Github/Repos';

import { Route } from 'react-router-dom';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {octokit: null};
  }

  authCallback = () => {
    this.setState({octokit: Octokit.get()});
  };

  componentDidMount () {
    this.authCallback();
  }

  render () {
    return (
      <div>
        <AppNavbar/>
        <main>
          <div className="container-fluid mt-5 pt-5">
            <Route exact path='/' render={(props) => <GithubRepoList {...props} octokit={this.state.octokit}/>}/>
            <Route path='/repos' render={(props) => <Repos {...props} octokit={this.state.octokit}/>}/>
            <Route path='/auth' render={(props) => <Auth {...props} authCallback={this.authCallback}/>}/>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
