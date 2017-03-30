function registerController($scope, $state, $stateParams, LoginService) {
  this.errors = {};
  this.success = false;

  console.log('refreshed with errors: ', this.errors);

  this.model = {
    username: null,
    password: null,
    email: null
  };

  if (LoginService.isLoggedIn()) {
    $state.go('home');
  }

  this.register = () => {
    return LoginService.registerRequest(this.model).then(result => {
      LoginService.setLoggedIn(result.username);
      $state.go('home');
    }).catch(err => {
      if (err.errors) {
        this.errors = err.errors;
        $scope.$digest();
      } else {
        alert('Registration failed, please try again later');
      }
    });
  };

  this.hasErrors = () => {
    return this.errors && Object.keys(this.errors).length > 0;
  };

  this.closeAlert = (key) => {
    delete this.errors[key];
  };

  this.clear = () => {
    Object.keys(this.model).forEach(key => this.model[key] = null);
    Object.keys(this.errors).forEach(key => this.errors[key] = null);
  };
}

module.exports = {
  name: 'registerController',
  fn: ['$scope', '$state', '$stateParams', 'LoginService', registerController]
};
