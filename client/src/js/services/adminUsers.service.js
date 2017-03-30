class AdminUsersService {
  constructor($http, LoginService) {
    this.$http = $http;
    this.users = [];
  }


  getUsersRequest() {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'get',
        url: '/auth/users'
      }).then(res => {
        console.log('setting users to: ', res.users);
        this.users = res.data;
        console.log('this.users: ', this.users);
        return resolve(res.data);
      }).catch(err => {
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  createUserRequest(formData) {
    return  new Promise((resolve, reject) => {
      return this.$http({
        method: 'post',
        url: '/auth/users',
        data: formData
      }).then(res => {
        console.log('setting users to: ', res.users);
        this.users = res.data;
        console.log('this.users: ', this.users);
        return resolve(res.data);
      }).catch(err => {
        if (err.data && err.data.errors) return reject({ errors: err.data.errors });
        if (err.status && err.statusText) return reject({ errors: { server: err.status + ' ' + err.statusText } });

        return reject(err);
      });
    });
  }

  deleteUserRequest(userID) {
    return new Promise((resolve, reject) => {
      return this.$http({
        method: 'delete',
        url: `/auth/users/${userID}`
      }).then(res => {
        console.log('deleted user: ' + userID);
        return resolve(res);
      }).catch(err => {
        console.log('error when deleting user: ', err);
        return reject(err);
      });
    });
  }
}


module.exports = {
  name: 'AdminUsersService',
  fn: ['$http', AdminUsersService]
};
