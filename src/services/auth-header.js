export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('idftoken'));
  if (!user) {
    user = JSON.parse(sessionStorage.getItem('idftoken-public'));
  }

  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  } else {
    return {};
  }
}
