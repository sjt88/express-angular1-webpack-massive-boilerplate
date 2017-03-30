function loginController($scope, $state, $stateParams, LoginService) {
  this.errors = [];

  this.model = {
    username: null,
    password: null
  };

  if (LoginService.isLoggedIn()) {
    $state.go('home');
  }

  this.login = () => {
    return LoginService.loginRequest(this.model).then(result => {
      $state.go('home');
    }).catch(err => {
      if (err.errors) {
        this.errors = Object.keys(err.errors).map(key => err.errors[key]);
      } else {
        this.errors = ['Registration failed, please try again later'];
      }
      $scope.$digest();
    });
  };
}

module.exports = {
  name: 'loginController',
  fn: ['$scope', '$state', '$stateParams', 'LoginService', loginController]
}
