const uuid = require('uuidv4');
import { EmployeeLogin } from '../../../models/types/employeeLogin';
import { CommandResponse, IEmployeeRepository } from '../../../types';
import EmployeeEntity from '../../../models/entities/employeeEntity';
import { StringExtensions } from '../../../extensions/StringExtensions';
import EmployeeRepository from '../../../models/repositories/employeeRepository';

export default class LoginCommand {
    public execute(): Promise<CommandResponse> {
		var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._employeeRepository.byEmployeeId(self._employeeLogin.employeeId)
                .then((existingEmployeeEntity: EmployeeEntity | undefined) => {
                    if (existingEmployeeEntity && (existingEmployeeEntity.password === EmployeeEntity.hashPassword(self._employeeLogin.password))) {
						resolveToRouter({ status: 200, message: '', data: existingEmployeeEntity.toJSON() });
                    } else {
                        rejectToRouter({ status: 401, message: 'User is not authorized.', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
	}

    private _employeeLogin: EmployeeLogin;
    public get employeeLogin (): EmployeeLogin { return this._employeeLogin; }
    public set employeeLogin (value: EmployeeLogin) { this._employeeLogin = value; }

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): IEmployeeRepository { return this._employeeRepository; }
	public set employeeRepository (value: IEmployeeRepository) { this._employeeRepository = value; }

    constructor({ employeeLogin = new EmployeeLogin(), employeeRepository = new EmployeeRepository() }: any = {}) {
        this._employeeLogin = employeeLogin;
        this._employeeRepository = employeeRepository;
    }
}