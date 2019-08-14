import { BACKEND_URI } from '../constants';

// https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift();
  }
  return null;
}

/**
 * Get the CSRF token
 *
 * @return {String}
 */
export default function getCsrfToken() {
  // Expired cookies will automatically be deleted so we
  // don't have to worry about refreshing this guy
  const token = getCookie('csrftoken');
  if (token) {
    return token;
  }

  // Fetch a new cookie
  // Realistically, this shouldn't ever happen but if it does,
  // they'll need the csrftoken before accessing /v1/private
  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open('HEAD', `${BACKEND_URI}/~csrf`, false); // force synchronous
  xmlHttpRequest.withCredentials = true; // pass along cookies
  xmlHttpRequest.send();
  return getCookie('csrftoken');
}
