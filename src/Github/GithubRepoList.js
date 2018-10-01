import React from 'react';
import GithubCard from './GithubCard';
import { Row, Col } from 'mdbreact';
import * as storage from '../storage';
import { Link } from 'react-router-dom';

class GithubRepoList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      repositories: [],
    };
  }

  removeRepoCallback = (repo) => {

    let savedRepos = JSON.parse(storage.local.getItem('githubRepos'));
    let newRepos = savedRepos.filter(r => r.id !== repo.id);

    storage.local.setItem('githubRepos', JSON.stringify(newRepos));
    this.setState({
      repositories: newRepos
    });
  };

  componentDidMount () {
    let repos = JSON.parse(storage.local.getItem('githubRepos'));
    if (repos === null) {
      repos = [];
    }

    this.setState({
      repositories: repos
    });
  }

  render () {
    const {repositories} = this.state;

    let out;
    if (repositories.length > 0) {
      const repositoryCards = repositories.map((repository, index) =>
        <Col className="col-4 mt-3" key={index}>
          <GithubCard removeRepoCallback={this.removeRepoCallback} octokit={this.props.octokit} repo={repository}/>
        </Col>
      );
      out = <Row>
        {repositoryCards}
      </Row>;
    } else {
      out = <Row>
        <Col>
          <p>No Repositories Configured</p>
          <p><Link to="/repos">Configure some now!</Link></p>
        </Col>
      </Row>;
    }

    return (out);
  }
}

export default GithubRepoList;