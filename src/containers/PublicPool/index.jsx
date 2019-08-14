import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Glyphicon,
  Table,
} from 'react-bootstrap';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import IndustrySelector from '../../components/IndustrySelector';
import {
  fetchPublicResumes,
} from './actions/Publicpool';
import {
  PUBLIC,
  UWATERLOO_DOMAIN,
  TAGS,
  PUBLIC_POOL_ITEMS_PER_PAGE,
} from '../../constants';
import ChangePoolModal from './ChangePoolModal';

class PublicPool extends Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      showGridView: true,
      searchQuery: '',
      prevQuery: '',
      activePage: 1,
      poolToQuery: '',
      showChangePoolModal: false,
    };
  }

  componentDidMount() {
    this.props.fetchPublicResumes(this.props.isLoggedIn, '', PUBLIC_POOL_ITEMS_PER_PAGE, 0);
  }

  onToggleView() {
    this.setState(prevState => ({
      showGridView: !prevState.showGridView,
    }));
  }

  searchPublicResumes() {
    if (this.state.prevQuery === this.state.searchQuery) {
      return;
    }

    this.setState(prevState => ({
      prevQuery: prevState.searchQuery,
      activePage: 1,
    }), () => {
      this.props.fetchPublicResumes(
        this.props.isLoggedIn,
        this.state.searchQuery,
        PUBLIC_POOL_ITEMS_PER_PAGE,
        0,
        this.state.poolToQuery,
      );
    });
  }

  changePool(poolToQuery) {
    this.setState({
      poolToQuery,
    }, () => {
      this.props.fetchPublicResumes(
        this.props.isLoggedIn,
        this.state.searchQuery,
        PUBLIC_POOL_ITEMS_PER_PAGE,
        0,
        poolToQuery,
      );
      this.closeChangePoolModal();
    });
  }

  openChangePoolModal() {
    this.setState({
      showChangePoolModal: true,
    });
  }

  closeChangePoolModal() {
    this.setState({
      showChangePoolModal: false,
    });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    const offset = (pageNumber - 1) * PUBLIC_POOL_ITEMS_PER_PAGE;
    this.props.fetchPublicResumes(
      this.props.isLoggedIn,
      this.state.prevQuery,
      PUBLIC_POOL_ITEMS_PER_PAGE,
      offset,
      this.state.poolToQuery,
    );
  }

  render() {
    const {
      resumes,
      history, // eslint-disable-line react/prop-types
    } = this.props;

    const isPrivatePoolQuery = this.state.poolToQuery !== PUBLIC
      && this.state.poolToQuery !== ''
      && this.state.poolToQuery !== UWATERLOO_DOMAIN;

    return (
      <div className="section-container">
        <div className="section-body">
          <div className="section-header" />
        </div>
        {this.props.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {!resumes || (this.state.activePage === 1 && resumes.length === 0)
              ? (
                <div>
                  {this.state.prevQuery === ''
                    ? (
                      <div>
                        <div className="action-bar-right">
                          <div className="horizontal-flex-container">
                            {(this.state.poolToQuery === '')
                              ? (
                                <Button
                                  className="light-btn"
                                  onClick={() => this.openChangePoolModal()}
                                >
                                  Secret Pool
                                </Button>
                              )
                              : (
                                <Button
                                  className="light-btn"
                                  onClick={() => this.changePool('')}
                                >
                                  Exit Secret Pool
                                </Button>
                              )
                            }
                          </div>
                        </div>
                        <div className="no-content-container">
                          <div className="no-content-title">There are no resumes available for critique in the public pool.</div>
                          <div className="no-content-description">You can add your resume here for anyone to critique.</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="horizontal-flex-container">
                          {(this.state.poolToQuery === '')
                            ? (
                              <Button
                                className="light-btn"
                                onClick={() => this.openChangePoolModal()}
                              >
                                Secret Pool
                              </Button>
                            )
                            : (
                              <Button
                                className="light-btn"
                                onClick={() => this.changePool('')}
                              >
                                Exit Secret Pool
                              </Button>
                            )
                          }
                          <IndustrySelector
                            selected={this.state.searchQuery}
                            onChange={industries => this.setState({
                              searchQuery: industries,
                            }, () => this.searchPublicResumes())
                            }
                            placeHolder="+ Filter by Industry"
                            singleInline
                          />
                        </div>
                        <div className="no-content-container">
                          <div className="no-content-title">No resumes matched your query. Please try a new search.</div>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
              : (
                <div>
                  <div className="action-bar-right">
                    <div className="horizontal-flex-container">
                      {(this.state.poolToQuery === '')
                        ? (
                          <Button
                            className="light-btn"
                            onClick={() => this.openChangePoolModal()}
                          >
                            Secret Pool
                          </Button>
                        )
                        : (
                          <Button
                            className="light-btn"
                            onClick={() => this.changePool('')}
                          >
                            Exit Secret Pool
                          </Button>
                        )
                      }
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
                      <IndustrySelector
                        selected={this.state.searchQuery}
                        onChange={industries => this.setState({
                          searchQuery: industries,
                        }, () => this.searchPublicResumes())
                        }
                        placeHolder="+ Filter by Industry"
                        singleInline
                      />
                    </div>
                  </div>
                  {this.state.showGridView
                    ? (
                      <div className="grid-container">
                        <Grid className="resume-grid-view" container justify="space-evenly" alignItems="center">
                          {resumes && resumes.map(resume => (
                            <Grid
                              key={resume.id}
                              item
                              className="resume-grid-item"
                              onClick={() => {
                                history.push(`/pooled-resume/${resume.id}${isPrivatePoolQuery ? `?${this.state.poolToQuery}` : ''}`);
                              }}
                            >
                              <div className="resume-thumbnail-container cursor-pointer">
                                {resume.thumbnailDownloadUrl
                                  ? (
                                    <img
                                      className="resume-thumbnail-img"
                                      src={resume.thumbnailDownloadUrl}
                                      alt="resume thumbnail"
                                    />
                                  )
                                  : <span className="resume-thumbnail-placeholder"><Glyphicon glyph="file" /></span>
                                }
                                <div className="resume-thumbnail-overlay">
                                  <div className="resume-thumbnail-description">{resume.description}</div>
                                  <div className="resume-thumbnail-industries">
                                    {map(resume.industries.split(','), industry => (
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
                                    reduce(
                                      map(resume.pooledcritiqueSet, c => (c.submitted ? 1 : 0)),
                                      (a, b) => a + b,
                                      0,
                                    )
                                  }
                                    {' '}
critiques
                                  </div>
                                  <div className="resume-thumbnail-info">
                                    {moment(resume.createdOn).local().format('YYYY-MM-DD')}
                                  </div>
                                </div>
                              </div>
                              <div className="resume-thumbnail-name cursor-pointer">{resume.name}</div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    )
                    : (
                      <Table responsive>
                        <thead className="table-header">
                          <tr className="table-row">
                            <th className="table-col-header">Name</th>
                            <th className="table-col-header">Description</th>
                            <th className="table-col-header">Industries</th>
                            <th className="table-col-header">Critiques</th>
                            <th className="table-col-header">Uploaded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumes
                  && resumes.map(row => (
                    <tr
                      className="entry"
                      key={row.id}
                      onClick={() => {
                        history.push(`/pooled-resume/${row.id}`);
                      }}
                    >
                      <td><span>{row.name}</span></td>
                      <td><span>{row.description}</span></td>
                      <td>
                        <span>
                          {map(
                            row.industries.split(','),
                            i => TAGS[i],
                          ).join(', ')
                      }
                        </span>
                      </td>
                      <td>
                        <span>
                          {
                        reduce(
                          map(row.pooledcritiqueSet, c => (c.submitted ? 1 : 0)),
                          (a, b) => a + b,
                          0,
                        )
                      }
                        </span>
                      </td>
                      <td className="short-col">
                        <span>
                          {moment(row.createdOn).local().format('YYYY-MM-DD')}
                        </span>
                      </td>
                    </tr>
                  ))}
                        </tbody>
                      </Table>
                    )
            }
                  {(this.props.resumeCount > PUBLIC_POOL_ITEMS_PER_PAGE) && (
                  <div className="pool-pagination">
                    <Pagination
                      activePage={this.state.activePage}
                      activeClass="active-page"
                      itemsCountPerPage={PUBLIC_POOL_ITEMS_PER_PAGE}
                      totalItemsCount={this.props.resumeCount}
                      prevPageText="<"
                      nextPageText=">"
                      hideFirstLastPages
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    />
                  </div>
                  )}
                </div>

              )
            }

            <ChangePoolModal
              title="Secret Pool"
              showModal={this.state.showChangePoolModal}
              closeModal={() => this.closeChangePoolModal()}
              changePool={poolToQuery => this.changePool(poolToQuery)}
            />

          </div>
        )}
      </div>
    );
  }
}

PublicPool.defaultProps = {
};

PublicPool.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  fetchPublicResumes: PropTypes.func.isRequired,
  resumes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  resumeCount: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  resumes: state.publicpool.resumes,
  loading: state.publicpool.loading,
  resumeCount: state.publicpool.resumeCount,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchPublicResumes,
  },
  dispatch,
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PublicPool),
);
