import angular from 'angular';
import uirouter from 'angular-ui-router';
import uibootstrap from 'angular-ui-bootstrap';

import router from './router';
import loginCheck from './logincheck';
import run from './run';

const dependencies = [
  uirouter,
  uibootstrap
];

var app = angular
  .module('app', dependencies)
  .config(router);

// import everything from controllers, directives, services
const controllersContext = require.context('./controllers', true, /^\.\/.*.js$/);
const servicesContext    = require.context('./services', true, /^\.\/.*.js$/);
const directivesContext  = require.context('./directives', true, /^\.\/.*.js$/);

const controllers = controllersContext.keys().map(key => controllersContext(key));
const services    = servicesContext.keys().map(key => servicesContext(key));
const directives  = directivesContext.keys().map(key => directivesContext(key));

controllers.forEach(controller => app.controller(controller.name, controller.fn));
services.forEach(service => app.service(service.name, service.fn));
directives.forEach(directive => app.directive(directive.name, directive.fn));

app.run(run);
