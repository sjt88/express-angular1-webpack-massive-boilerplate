function adminUsersController($scope, AdminUsersService, LoginService) {
  this.errors = {};
  this.model = {
    users: [],
    create: {
      username: null,
      password: null,
      email: null
    },
    activeUser: null
  };

  AdminUsersService.getUsersRequest().then(users => {
    this.model.users = AdminUsersService.users;
    $scope.$digest();
  }).catch(err => {
    alert('Failed to retrieve user list');
    console.error(err);
  });

  this.submitCreateUserForm = () => {
    return AdminUsersService.createUserRequest(this.model.create).then(result => {
      console.log('response: ', result);
      this.model.users.push(result);
      $scope.$digest();
      console.log(this.model.users);
    }).catch(err => {
      if (err.errors) {
        this.errors = err.errors;
        $scope.$digest();
      } else {
        alert('Registration failed, please try again later');
      }
    });
  };

  this.clearCreateUserForm = () => {
    this.model.create.username = null;
    this.model.create.password = null;
    this.model.create.email = null;
  };

  this.activateUser = index => {
    if (this.model.activeUser != null) this.model.users[this.model.activeUser].isActive = false;
    this.model.users[index].isActive = true;
    this.model.activeUser = index;
  };

  this.deleteUser = index => {
    console.log('deleting user: ' + index);
    let user = this.model.users[index];
    return AdminUsersService.deleteUserRequest(user.id).then(result => {
      this.model.users.splice(index, 1);
      $scope.$digest();
    }).catch(err => {
      alert('Failed to delete user');
    });
  };
}

module.exports = {
  name: 'adminUsersController',
  fn: ['$scope', 'AdminUsersService', 'LoginService', adminUsersController]
};
