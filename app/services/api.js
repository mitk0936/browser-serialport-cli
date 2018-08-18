import 'isomorphic-fetch';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const handleBadResponse = function (response) {
  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }

  return response.json();
};

export const fetchPermissions = () =>
  fetch('/app', {
    method: 'GET',
    headers
  })
  .then(handleBadResponse)
  .then(function (response) {
    return {
      permissions: response.permissions || []
    }
  });