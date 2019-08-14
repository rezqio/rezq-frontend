import React from 'react';
import PropTypes from 'prop-types';
import RezModal from './Modal';
import CritiqueView from './CritiqueView';

const ViewCritique = props => (
  <CritiqueView
    critiqueId={props.critiqueId}
    uploaderView={props.uploaderView}
  />
);

ViewCritique.propTypes = {
  critiqueId: PropTypes.string.isRequired,
  uploaderView: PropTypes.bool.isRequired,
};

export default RezModal(ViewCritique);
