import React from 'react';
import { Row, Col, Table, TableBody, TableHead, Input } from 'mdbreact';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as storage from '../storage';

class Repos extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      error: null,
      loaded: false,
      redirect: false,
      repos: [],
    };
  }

  componentDidMount () {
    let storedRepos = JSON.parse(storage.local.getItem('githubRepos'));
    if (storedRepos === null) {
      storedRepos = [];
    }

    if (this.props.octokit && this.props.octokit.auth) {
      this.props.octokit.repos.getAll({sort: 'updated', per_page: 100})
        .then(
          (result) => {
            let repos = [];
            result.data.forEach((repo) => {
              let selected = false;

              let r = storedRepos.find(r => r.id === repo.id);
              if (r) {
                selected = r.selected;
              }

              repos.push({
                id: repo.id,
                owner: repo.owner.login,
                name: repo.name,
                selected: selected
              });
            });

            this.setState({
              loaded: true,
              repos: repos
            });
          },
          (error) => {
            this.setState({
              loaded: true,
              error: error
            });
          }
        );
    } else {
      this.setState({
        redirect: true,
      });
    }
  }

  addRepo (e) {
    let checked = e.target.checked;
    let repos = this.state.repos;

    let repo = repos.find(repo => repo.id === parseInt(e.target.value, 10));
    let index = repos.indexOf(repo);
    repos.fill(repo.selected = checked, index, index++);

    storage.local.setItem('githubRepos', JSON.stringify(repos.filter(repo => repo.selected)));

    this.setState({
      repos: repos
    });
  }

  render () {
    const {redirect, repos, loaded} = this.state;

    let redirectDo = <Redirect to="/"/>;

    let tableRows;
    if (loaded) {
      tableRows = repos.map((repo) => {
          return <tr key={repo.id}>
            <td>
              <Input onChange={this.addRepo.bind(this)} type="checkbox" value={repo.id} checked={repo.selected}/>
            </td>
            <td>{repo.owner}</td>
            <td>{repo.name}</td>
          </tr>;
        }
      );
    } else {
      tableRows = <tr>
        <td>
          <FontAwesomeIcon className="fa-pulse" icon={faSpinner}/>
        </td>
      </tr>;
    }

    let out;

    if (redirect) {
      out = redirectDo;
    } else {
      out = <Row>
        <Col>
          <Table>
            <TableHead>
              <tr>
                <th>&nbsp;</th>
                <th>Owner</th>
                <th>Repo Name</th>
              </tr>
            </TableHead>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </Col>
      </Row>;
    }

    return (out);
  }
}

export default Repos;