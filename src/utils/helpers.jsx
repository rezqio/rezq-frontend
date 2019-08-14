export const industriesShortener = (industries) => {
  // TODO: Display constants for each industry
  const industriesList = industries.split(',');
  if (industriesList.length > 1) {
    return `${industriesList[0]}, ...`;
  }
  return industries;
};

/* eslint-disable prefer-promise-reject-errors */
export const makeCancelable = (promise) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error)),
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};
/* eslint-disable prefer-promise-reject-errors */
