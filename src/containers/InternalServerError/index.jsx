import React from 'react';

function InternalServerError() {
  return (
    <div className="section-body">
      <div className="section-centered">
        <div className="errorContainer">
          <div className="error-header">500 - Internal Server Error</div>
            Oops! Something broke on our end.
          {' '}
          {"We'll"}
          {' '}
    try to get this fixed as
            soon as possible.
          <p>
            <a href="https://github.com/rezqio/issues">
                Tell us about this!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InternalServerError;
