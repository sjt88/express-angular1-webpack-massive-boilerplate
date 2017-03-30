import template from './navbar.template.html';

function navbarDirective($state, LoginService) {

  return {
    templateUrl: template,
    scope: {
      isNavCollapsed: '&',
      accountDropdownCollapsed: '&',
      apptitle: '@',
    },
    link: function(scope, element, attrs) {
      scope.LoginService = LoginService;
    }
  };
};

module.exports = {
  name: 'navbarDirective',
  fn: ['$state', 'LoginService', navbarDirective]
};
