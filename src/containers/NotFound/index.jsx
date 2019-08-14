import React from 'react';
import '../error.css';

function NotFound() {
  return (
    <div className="section-body">
      <div className="section-centered">
        <div className="errorContainer">
          <div className="error-header">404 - Not Found</div>
            Uh oh! The page you were looking for
          {' '}
          {"doesn't"}
          {' '}
    seem to exist.
          {' '}
          <p>
            <a href="/">
                Get me out of here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
