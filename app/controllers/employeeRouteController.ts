import * as restify from 'restify';
import RouteController from './routeController';
import LoginCommand from './commands/employee/loginCommand';
import CreateCommand from './commands/employee/createCommand';
import DeleteCommand from './commands/employee/deleteCommand';
import UpdateCommand from './commands/employee/updateCommand';
import EmployeeEntity from '../models/entities/employeeEntity';
import { IEmployeeRepository, CommandResponse } from '../types';
import ActiveCountsQuery from './commands/employee/activeCountsQuery';
import EmployeeRepository from '../models/repositories/employeeRepository';

export default class EmployeeRouteController extends RouteController {
	public queryEmployeeById(req: restify.Request, res: restify.Response, next: restify.Next) {
		EmployeeRouteController.employeeRepository.get(req.params.id)
			.then((employeeEntity: (EmployeeEntity | undefined)) => {
				if (employeeEntity) {
					res.send(200, employeeEntity.toJSON());
				} else {
					res.send(404)
				}
				return next();
			}, (reason: any) => {
				return next(new Error(reason.message));
			});
	}

	public queryActiveEmployeeCounts(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new ActiveCountsQuery({ classification: +req.params.classification, employeeRepository: EmployeeRouteController.employeeRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public createEmployee(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new CreateCommand({ employeeToSave: req.body, employeeRepository: EmployeeRouteController.employeeRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public updateEmployeeById(req: restify.Request, res: restify.Response, next: restify.Next) {
		(new UpdateCommand({ employeeId: req.params.id, employeeToSave: req.body, employeeRepository: EmployeeRouteController.employeeRepository }))
			.execute()
			.then((response: CommandResponse) => {
				res.send(response.status, response.data);
				return next();
			}, (reason: CommandResponse) => {
				res.send(reason.status, reason.message);
				return next();
			});
	}

    public deleteEmployeeById(req: restify.Request, res: restify.Response, next: restify.Next) {
        (new DeleteCommand({ employeeId: req.params.id, employeeRepository: EmployeeRouteController.employeeRepository }))
            .execute()
            .then((response: CommandResponse) => {
                res.send(response.status);
                return next();
            }, (reason: CommandResponse) => {
                res.send(reason.status, reason.message);
                return next();
            });
	}

    public loginEmployee(req: restify.Request, res: restify.Response, next: restify.Next) {
        (new LoginCommand({ employeeLogin: req.body, employeeRepository: EmployeeRouteController.employeeRepository }))
            .execute()
            .then((response: CommandResponse) => {
                res.send(response.status, response.data);
                return next();
            }, (reason: CommandResponse) => {
                res.send(reason.status, reason.message);
                return next();
            });
	}

	private static employeeRepository: IEmployeeRepository = new EmployeeRepository();
}