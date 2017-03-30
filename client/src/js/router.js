import homeTemplate from '../templates/home.template.html';
import logoutTemplate from '../templates/logout.template.html';
import loginTemplate from '../templates/login.template.html';
import registerTemplate from '../templates/register.template.html';
import adminTemplate from '../templates/admin.template.html';
import adminScopesTemplate from '../templates/admin.scopes.template.html';
import adminUsersTemplate from '../templates/admin.users.template.html';
import adminUserDetailTemplate from '../templates/admin.users.detail.template.html';
import notFound404Template from '../templates/404.template.html';

function router($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {
  let states = [{
    name: 'home',
    url: '/',
    templateUrl: homeTemplate,
    controller: 'homeController as home'
  }, {
    name: 'logout',
    url: '/logout',
    templateUrl: logoutTemplate,
    controller: 'logoutController as logout'
  }, {
    name: 'login',
    url: '/login',
    templateUrl: loginTemplate,
    controller: 'loginController as login'
  }, {
    name: 'register',
    url: '/register',
    templateUrl: registerTemplate,
    controller: 'registerController as register'
  }, {
    name: 'admin',
    url: '/admin',
    templateUrl: adminTemplate,
    controller: 'adminController as admin'
  }, {
    name: 'admin.scopes',
    parent: 'admin',
    url: '/scopes',
    templateUrl: adminScopesTemplate,
    controller: 'adminScopesController as scopes'
  }, {
    name: 'admin.users',
    parent: 'admin',
    url: '/users',
    templateUrl: adminUsersTemplate,
    controller: 'adminUsersController as users'
  }, {
    name: 'admin.users.detail',
    parent: 'admin.users',
    url: '/detail',
    params: {userData: null},
    templateUrl: adminUserDetailTemplate,
    controller: 'userDetailController as userDetail'
  }, {
    name: '404', 
    url: '/404',
    templateUrl: notFound404Template
  }];

  states.forEach(state => $stateProvider.state(state.name, state));
  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) $location.path('/login');
        else $location.path('404');
        return $q.reject(response);
      }
    };
  });
}

module.exports = [
  '$urlRouterProvider',
  '$stateProvider',
  '$locationProvider',
  '$httpProvider',
  router
];
