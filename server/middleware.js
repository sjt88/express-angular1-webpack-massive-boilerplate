function isAuthenticated(req, res, next) {
  if (req.session.authenticated) return next();
  else return res.sendStatus(401);
}

function isNotAuthenticated(req, res, next) {
  if (!req.session.authenticated) return next();
  else return res.redirect('/');
}

/**
 * Scope Authorization Middleware factory
 * Can be used to restrict access to a route to any or all of an array of scope names
 * @param  {Array} requiredScopeNames - List of scope name strings to allow
 * @param  {Boolean} [all]            - when true: user must have ALL scopes in requiredScopeNames assigned
 *                                      when false: user must have at least ONE scope in requiredScopeNames assigned
 * @return {Function}                 - Connect middleware function
 */
function requiresScopes(requiredScopeNames, all) {
  return (req, res, next) => {
    if (!req.session.authenticated) return res.sendStatus(401);
    if (!req.session.authorized_scopes_names) return res.sendStatus(500);

    console.log('req.session.authorized_scopes_names: ' + req.session.authorized_scopes_names);
    console.log('requiredScopeNames: ' + requiredScopeNames);

    let authorized = false;

    if (all) {
      authorized = !requiredScopeNames.map(scope => {
        return req.session.authorized_scopes_names.indexOf(scope)  > -1;
      }).includes(false);
    } else {
      requiredScopeNames.forEach(scope => {
        if (req.session.authorized_scopes_names.indexOf(scope) > -1) authorized = true;
      });
    }
    if (!authorized) {
      console.log('User is not authorized');
      return res.sendStatus(403);
    };

    console.log('user is authorized');
    return next();
  };
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  requiresScopes
};
