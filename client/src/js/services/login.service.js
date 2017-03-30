class LoginService {
  constructor($http) {
    this.$http = $http;
    this.loggedIn = false;
    this.loginName = null;
    this.authorizedScopes = [];
  }

  setLoggedIn(name) {
    this.loginName = name;
    this.loggedIn = true;
  }

  setLoggedOut() {
    this.loggedIn = false;
    this.loginName = null;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getLoginName() {
    return this.loginName;
  }

  setAuthorizedScopes(scopes) {
    this.authorizedScopes = scopes;
  }

  getAuthorizedScopes() {
    return this.authorzedScopes;
  }

  registerRequest(formData) {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'post',
        url: '/auth/register',
        data: formData
      }).then(res => {
        console.log('register request OK');
        return resolve(res.data);
      }).catch(err => {
        console.log('registerRequest error:', err);
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  loggedinRequest() {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'get',
        url: '/auth/loggedin'
      }).then(res => {
        if (res.data.loggedin && res.data.username) {
          this.setLoggedIn(res.data.username);
          if (Array.isArray(res.data.scopes)) this.setAuthorizedScopes(res.data.scopes);

          return resolve({ loggedin: true, username: res.data.username });
        }

        return resolve({ loggedin: false });
      }).catch(err => {
        return resolve(false);
      });
    });
  }

  loginRequest(formData) {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'post',
        url: '/auth/login',
        data: formData
      }).then(res => {
        this.setLoggedIn(res.data.username);
        return resolve({ username: res.data.username });
      }).catch(err => {
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  logoutRequest() {
    return this.$http({
      method: 'get',
      url: '/auth/logout'
    }).then(() => {
      this.setLoggedOut();
    });
  }
}


module.exports = {
  name: 'LoginService',
  fn: ['$http', LoginService]
};
