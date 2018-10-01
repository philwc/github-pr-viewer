import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'mdbreact';
import PRTable from './PRTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

class GithubCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: null,
      pullsLoaded: false,
      repoLoaded: false,
      pulls: [],
      repo: null
    };
  }

  componentDidMount () {
    if (this.props.octokit && this.props.octokit.auth) {
      this.loadData();
      let interval = 60 * 1000 * 10; // Ten Minutes
      let intervalId = setInterval(this.loadData.bind(this), interval);
      this.setState({intervalId: intervalId});
    } else {
      this.setState({
        repoLoaded: true,
        error: {message: 'Not Authenticated'}
      });
    }
  }

  componentWillUnmount () {
    let intervalId = this.state.intervalId;
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  loadData () {
    this.props.octokit.pullRequests.getAll({owner: this.props.repo.owner, repo: this.props.repo.name})
      .then(
        (result) => {
          this.setState({
            pullsLoaded: true,
            pulls: result.data
          });
        },
        (error) => {
          this.setState({
            pullsLoaded: true,
            error: error
          });
        }
      );

    this.props.octokit.repos.get({owner: this.props.repo.owner, repo: this.props.repo.name})
      .then(
        (result) => {
          this.setState({
            repoLoaded: true,
            repo: result.data
          });
        },
        (error) => {
          this.setState({
            repoLoaded: true,
            error: error
          });
        }
      );
  }

  removeRepo () {
    this.props.removeRepoCallback(this.props.repo);
  }

  render () {
    const {error, repoLoaded, pullsLoaded, pulls, repo} = this.state;
    let text = '';
    if (error) {
      text = <CardText>Error: {error.message}</CardText>;
    } else if (!pullsLoaded && !repoLoaded) {
      text = <FontAwesomeIcon className="fa-pulse" icon={faSpinner}/>;
    }

    let title = <span>
      <FontAwesomeIcon icon={faGithub}/>
      &nbsp;{this.props.repo.owner}/{this.props.repo.name}
       </span>;
    if (repoLoaded && repo) {
      title = <a className='text-muted' href={repo.html_url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>;
    }

    return (
      <Card>
        <CardBody>
          <CardTitle>
            <Row>
              <Col className="col-11">
                {title}
              </Col>
              <Col className="col-1">
                <a className='text-muted pull-right' onClick={this.removeRepo.bind(this)} href="#">
                  <FontAwesomeIcon icon={faTimes}/>
                </a>
              </Col>
            </Row>


          </CardTitle>
          {text}
          {pullsLoaded &&
          <PRTable pulls={pulls}/>}
        </CardBody>
      </Card>
    );
  }
}

export default GithubCard;