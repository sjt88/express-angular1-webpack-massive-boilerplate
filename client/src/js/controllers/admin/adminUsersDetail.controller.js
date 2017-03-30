function userDetailController($scope, $stateParams, $state, AdminScopesService, AdminUsersService) {
  console.log($stateParams.userData);
  if (!$stateParams.userData) return $state.go('admin.users');

  this.errors = {};
  this.model = {
    user: {
      id: null,
      username: null,
      email: null,
      authorized_scopes: []
    },
    userbackup: {
      id: null,
      username: null,
      email: null,
      authorized_scopes: []
    },
    scopes: []
  };

  this.setUserModel = userData => {
    this.model.user = {
      id: userData.id || null,
      username: userData.username || null,
      email: userData.email || null,
      authorized_scopes: userData.authorized_scopes ? userData.authorized_scopes.map(scope => scope) : []
    };

    // backup of current user data, for clear functionality
    this.model.userbackup = {
      id: userData.id || null,
      username: userData.username || null,
      email: userData.email || null,
      authorized_scopes: userData.authorized_scopes ? userData.authorized_scopes.map(scope => scope) : []
    };
  };

  this.resetUserModel = () => {
    console.log('resetting scopes');
    let userData = Object.assign({}, this.model.userbackup);
    this.model.user.id = userData.id || null;
    this.model.user.username = userData.username || null;
    this.model.user.email = userData.email || null;
    this.model.user.authorized_scopes = userData.authorized_scopes.map(scope => scope) || [];
  };

  this.addScope = scope => {
    this.model.user.authorized_scopes.push(scope.id);
  };

  this.removeScope = scope => {
    let index = this.model.user.authorized_scopes.indexOf(scope.id);
    this.model.user.authorized_scopes.splice(index, 1);
  };

  this.updateScopes = () => {
    let id = this.model.user.id;
    let scopes = this.model.user.authorized_scopes;

    console.log('updating scopes for user: ', id);
    console.log('scopes: ', scopes);

    AdminScopesService.updateUserAuthorizedScopes(id, scopes).then(updatedScopes => {
      let user = AdminUsersService.users.find(user => user.id == id);
      user.authorized_scopes = updatedScopes.authorized_scopes.map(scope => scope);
      this.setUserModel(this.model.user);
      console.log(updatedScopes);
    }).catch(err => {
      console.log(err);
      alert('Failed to update users scopes');
    });
  };

  this.getAuthorizedScopes = () => {
    return this.model.scopes.filter(scope => {
      return this.model.user.authorized_scopes.indexOf(scope.id) > -1;
    });
  };

  this.getNotAuthorizedScopes = () => {
    return this.model.scopes.filter(scope => {
      return this.model.user.authorized_scopes.indexOf(scope.id) == -1;
    });
  };


  this.setUserModel($stateParams.userData);
  
  AdminScopesService.getScopesRequest().then(scopes => {
    console.log('got scopes: ', scopes);
    this.model.scopes = scopes;
    console.log(this.model);
    $scope.$digest();
  }).catch(err => {
    console.log(err);
    alert('Failed to retrieve scopes');
  });
}

module.exports = {
  name: 'userDetailController',
  fn: userDetailController
};
