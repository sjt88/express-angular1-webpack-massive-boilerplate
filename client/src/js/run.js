function run(LoginService, $state) {
  LoginService.loggedinRequest().then(res => {
    console.log('run login request:');
    console.log(res);
    if (res.loggedin) $state.go('home');
  });
}

module.exports = [
	'LoginService',
	'$state',
	run
];