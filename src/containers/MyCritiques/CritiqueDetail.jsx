import React from 'react';
import CritiqueView from '../../components/CritiqueView';

/* eslint-disable react/prop-types */
const CritiqueDetail = props => (
  <CritiqueView location={props.location} critiqueId={props.match.params.id} />
);
/* eslint-disable react/prop-types */

export default CritiqueDetail;
