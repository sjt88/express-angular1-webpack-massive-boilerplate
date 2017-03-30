function adminScopesController($scope, AdminScopesService) {
  this.model = {
    scopes: [],
    create: {
      name: null,
      description: null
    }
  }

  AdminScopesService.getScopesRequest().then(scopes => {
    this.model.scopes = scopes;
    $scope.$digest();
  });

  this.submitCreateScopeForm = () => {
    AdminScopesService.createScopesRequest(this.model.create).then(res => {
      this.model.scopes = AdminScopesService.scopes;
      this.model.create.name = null;
      this.model.create.description = null;
      $scope.$digest();

    }).catch(err => {
      alert(err);
    });
  }

  this.clearCreateScopeForm = () => {
    console.log(this.model)
    this.model.create.name = null;
    this.model.create.description = null;
  }

  this.selectScope = index => {
    if (this.model.scopes[index].selected) this.model.scopes[index].selected = false;
    else this.model.scopes[index].selected = true;
  }

  this.scopeIsSelected = index => {
    console.log(this.model.scopes);
    return this.model.scopes[index].selected ? true : false;
  }

  this.deleteSelectedScopes = () => {
    let scopes = this.model.scopes.map((scope, index) => scope.selected ? index : null).filter(scope => scope != undefined);
    console.log('selected scope indexes: ',scopes);
    return AdminScopesService.deleteMultipleScopesRequest(scopes).then(result => {
      console.log('deleted scope: ', result);
      $scope.$digest();
    }).catch(err => {
      console.error(err);
    });
    console.log(selectedScopes);
  }
}

module.exports = {
  name: 'adminScopesController',
  fn: ['$scope', 'AdminScopesService', adminScopesController]
}
