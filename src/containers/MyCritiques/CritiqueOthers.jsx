import React from 'react';
import { withRouter } from 'react-router-dom';

import PastCritiques from '../../components/PastCritiques';

const CritiqueOthers = () => (
  <div className="section-container">
    <div>
      <PastCritiques />
    </div>
  </div>
);

export default withRouter(CritiqueOthers);
