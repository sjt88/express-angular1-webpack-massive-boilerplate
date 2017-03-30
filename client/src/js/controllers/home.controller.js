function homeController($scope, $stateParams, LoginService) {
	let vm = this;

  vm.isLoggedIn = false;
  vm.username = false;
  vm.LoginService = LoginService;

  if (!vm.LoginService.isLoggedIn()) {
    LoginService.loggedinRequest().then(res => {
      console.log(res);
      if (res.loggedin) {
        vm.isLoggedIn = true;
        vm.username = vm.LoginService.getLoginName();
        $scope.$digest();
      }
    });
  } else {
    vm.username = vm.LoginService.getLoginName();
  }

  window.LoginService = LoginService;
}

module.exports = {
  name: 'homeController',
  fn: [
    '$scope',
  	'$stateParams',
  	'LoginService',
  	homeController
	]
};
