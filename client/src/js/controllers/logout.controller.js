function logoutController($state, LoginService) {
  let vm = this;

  vm.logout = () => {
    LoginService.logoutRequest().then(() => {
      $state.go('home');
    });
  }
}

module.exports = {
  name: 'logoutController',
  fn: ['$state', 'LoginService', logoutController]
}
