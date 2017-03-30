class AdminScopesService {
  constructor($http) {
    this.$http = $http;
    this.scopes = [];
  }


  getScopesRequest() {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'get',
        url: '/auth/scopes'
      }).then(res => {
        this.scopes = res.data;
        return resolve(res.data);
      }).catch(err => {
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  createScopesRequest(formData) {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'post',
        url: '/auth/scopes',
        data: formData
      }).then(res => {
        this.scopes.push(res.data);
        return resolve(res.data);
      }).catch(err => {
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  deleteScopeRequest(scopeIndex) {
    let scopeID = this.scopes[scopeIndex].id;
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'delete',
        url: `/auth/scopes/${scopeID}`
      }).then(res => {
        let deletedScopeIndex = this.scopes.map((scope, index) => {
          console.log(scope);
          return scope.id == res.data[0].id ?  index: null;
        }).filter(scopeIndex => {
          return scopeIndex != undefined;
        });
        this.scopes.splice(deletedScopeIndex, 1);
        resolve(res.data[0]);
      }).catch(err => {
        console.error(err);
        return reject(err);
      });
    });
  }

  deleteMultipleScopesRequest(scopeIDs) {
    console.log('deleting scopes: ', scopeIDs);
    return Promise.all(scopeIDs.map(id => {
      console.log('deleting: ' + id);
      return this.deleteScopeRequest(id);
    }));
  }

  updateUserAuthorizedScopes(id, scopes) {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'post',
        url: `/auth/users/${id}/scopes`,
        data: {authorized_scopes: scopes}
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        console.error(err);
        return reject(err);
      });
    });
  }
}


module.exports = {
  name: 'AdminScopesService',
  fn: ['$http', AdminScopesService]
};
