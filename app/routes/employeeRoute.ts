import * as restify from 'restify';
import EmployeeRouteController from '../controllers/employeeRouteController'

function employeeRoute(server: restify.Server) {
  let routeController = new EmployeeRouteController();

  server.get({ path: '/api/employee/:id', version: '0.0.1' }, routeController.queryEmployeeById);

  server.get({ path: '/api/employee/activecounts/:classification', version: '0.0.1' }, routeController.queryActiveEmployeeCounts);
  
  server.post({ path: '/api/employee/', version: '0.0.1' }, routeController.createEmployee)

  server.put({ path: '/api/employee/:id', version: '0.0.1' }, routeController.updateEmployeeById);

  server.del({ path: '/api/employee/:id', version: '0.0.1' }, routeController.deleteEmployeeById);
  
  server.post({ path: '/api/employee/login/', version: '0.0.1' }, routeController.loginEmployee)
  
  server.get({ path: '/api/test/employee/', version: '0.0.1' }, (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, 'Successful test. (Employee routing).');
    return next();
  });
}

module.exports.routes = employeeRoute;
