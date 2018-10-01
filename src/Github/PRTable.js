import React from 'react';
import { Table, TableBody, TableHead, Button, Collapse } from 'mdbreact';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

class PRTable extends React.Component {
  constructor (props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      collapse: false,
    };
  }

  toggle () {
    this.setState({collapse: !this.state.collapse});
  }

  render () {
    let pulls = this.props.pulls;
    const tableRows = pulls.map((pull) => {
      let updated = moment(pull.updated_at).fromNow();
      let updated_abs = moment(pull.updated_at).format('dddd, MMMM Do YYYY, h:mm:ss a');

      return <tr key={pull.id}>
        <td>
          <a color='primary' href={pull.html_url} target='_blank' rel="noopener noreferrer">#{pull.number} - {pull.title}</a>
        </td>
        <td>
          <img src={pull.user.avatar_url} style={{width: '25px'}}
               className="rounded-circle mr-3" alt="{pull.user.login}"/>
          <span>{pull.user.login}</span>
        </td>
        <td title={updated_abs}>
          {updated}
        </td>
      </tr>;
    });

    let btnText;
    if (this.state.collapse) {
      btnText = <span><FontAwesomeIcon icon={faChevronUp}/> Hide</span>;
    } else {
      btnText = <span><FontAwesomeIcon icon={faChevronDown}/> Show ({pulls.length})</span>;
    }

    let out;

    if (pulls.length > 0) {
      out = <div>
        <Button size="sm" color="primary" onClick={this.toggle}>{btnText}</Button>

        <Collapse isOpen={this.state.collapse}>
          <Table>
            <TableHead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Updated</th>
              </tr>
            </TableHead>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </Collapse>
      </div>;
    } else {
      out = <p>No Pull Requests Found</p>;
    }

    return (out);
  }
}

export default PRTable;

