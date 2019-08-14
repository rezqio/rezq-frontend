import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Glyphicon,
  Table,
} from 'react-bootstrap';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import moment from 'moment';
import { CRITIQUE_TYPES, TAGS } from '../../constants';
import { fetchCritiques } from './actions/Pastcritiques';


const redirectToCritique = (critique, history) => {
  if (critique.critiqueType === CRITIQUE_TYPES.MATCHED) {
    return () => { history.push(`/critiques/${critique.id}`); };
  } if (critique.critiqueType === CRITIQUE_TYPES.LINKED) {
    return () => { history.push(`/shared-critique/${critique.token}`); };
  }
  return () => { history.push(`/pooled-critique/${critique.id}`); };
};

const renderNoCritiquesView = () => (
  <div className="no-content-container">
    <div className="no-content-title">You currently do not have any critiques.</div>
    <div className="no-content-description">
      Find a resume to critique in the resume pool.
      <br />
      <br />
      <Button
        className="highlight-btn-small"
        onClick={() => { window.location.href = '/pool'; }}
      >
        Go To Resume Pool
      </Button>
    </div>
  </div>
);

class PastCritiques extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showGridView: true,
    };
  }

  componentDidMount() {
    this.props.fetchCritiques();
  }

  onToggleView() {
    this.setState(prevState => ({
      showGridView: !prevState.showGridView,
    }));
  }

  render() {
    const {
      critiques,
      pooledcritiques,
      linkedcritiques,
      history, // eslint-disable-line react/prop-types
    } = this.props;

    const allCritiques = [];

    forEach(critiques, (critique) => {
      allCritiques.push({ ...critique, critiqueType: CRITIQUE_TYPES.MATCHED });
    });

    forEach(pooledcritiques, (pooledCritique) => {
      allCritiques.push({ ...pooledCritique, critiqueType: CRITIQUE_TYPES.POOLED });
    });

    forEach(linkedcritiques, (linkedCritique) => {
      allCritiques.push({ ...linkedCritique, critiqueType: CRITIQUE_TYPES.LINKED });
    });

    const sortedCritiques = orderBy(allCritiques, ['submittedOn'], ['desc']);

    return (
      <div>
        {this.props.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {!sortedCritiques || sortedCritiques.length === 0
              ? renderNoCritiquesView()
              : (
                <div>
                  <div className="action-bar">
                    <div />
                    <div>
                      <Button
                        className="light-btn"
                        onClick={() => this.onToggleView()}
                      >
                        <Glyphicon
                          glyph={this.state.showGridView ? 'th-list' : 'th-large'}
                        />
                        {' '}
                        Toggle View
                      </Button>
                    </div>
                  </div>
                  {this.state.showGridView
                    ? (
                      <div className="grid-container">
                        <Grid className="resume-grid-view" container justify="space-evenly" alignItems="center">
                          {sortedCritiques.map(critique => (
                            <Grid
                              key={critique.resume.id}
                              item
                              className="resume-grid-item"
                              onClick={redirectToCritique(critique, history)}
                            >
                              <div className="resume-thumbnail-container cursor-pointer">
                                {critique.resume.thumbnailDownloadUrl
                                  ? (
                                    <img
                                      className="resume-thumbnail-img"
                                      src={critique.resume.thumbnailDownloadUrl}
                                      alt="resume thumbnail"
                                    />
                                  )
                                  : <span className="resume-thumbnail-placeholder"><Glyphicon glyph="file" /></span>
                              }
                                <div className="resume-thumbnail-overlay">
                                  <div className="resume-thumbnail-description">{critique.resume.description}</div>
                                  <div className="resume-thumbnail-industries">
                                    {map(critique.resume.industries.split(','), industry => (
                                      <Chip
                                        className="chip selected"
                                        color="primary"
                                        label={TAGS[industry]}
                                      />
                                    ))
                        }
                                  </div>
                                  <div className="resume-thumbnail-info">
                                    {
                                      critique.submittedOn !== null
                                        ? moment(critique.submittedOn).local().format('YYYY-MM-DD')
                                        : 'Incomplete'
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="resume-thumbnail-name cursor-pointer">{critique.resume.name}</div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    )
                    : (
                      <Table hover responsive>
                        <thead className="table-header">
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Industries</th>
                            <th>Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="table-content">
                          {map(sortedCritiques, critique => (
                            <tr
                              className="entry"
                              key={critique.id}
                              onClick={redirectToCritique(critique, history)}
                            >
                              <td><span>{critique.resume.name}</span></td>
                              <td><span>{critique.resume.description}</span></td>
                              <td>
                                <span>
                                  {map(
                                    critique.resume.industries.split(','),
                                    i => TAGS[i],
                                  ).join(', ')
                  }
                                </span>
                              </td>
                              <td className="short-col">
                                {
                                  critique.submittedOn !== null
                                    ? moment(critique.submittedOn).local().format('YYYY-MM-DD')
                                    : 'Incomplete'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                </div>
              )
                      }
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.pastcritiques.loading,
  critiques: state.pastcritiques.critiques,
  pooledcritiques: state.pastcritiques.pooledcritiques,
  linkedcritiques: state.pastcritiques.linkedcritiques,
});

const mapDispatchToProps = {
  fetchCritiques,
};

PastCritiques.propTypes = {
  fetchCritiques: PropTypes.func.isRequired,
  critiques: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  pooledcritiques: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  linkedcritiques: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PastCritiques),
);
