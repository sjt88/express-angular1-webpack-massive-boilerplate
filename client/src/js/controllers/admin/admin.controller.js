function adminController($state) {
  this.model = {
    nav: {
      active: false
    }
  }
}

module.exports = {
  name: 'adminController',
  fn: ['$state', adminController]
}
