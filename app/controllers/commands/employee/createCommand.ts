const uuid = require('uuidv4');
import { Employee } from '../../../models/types/employee';
import { CommandResponse, IEmployeeRepository } from '../../../types';
import EmployeeEntity from '../../../models/entities/employeeEntity';
import { StringExtensions } from '../../../extensions/StringExtensions';
import EmployeeRepository from '../../../models/repositories/employeeRepository';

export default class CreateCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            if (StringExtensions.isNullOrWhitespace(self._employeeToSave.firstName)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: first name.', data: {} });
            }
            if (StringExtensions.isNullOrWhitespace(self._employeeToSave.lastName)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: first name.', data: {} });
            }
            if (StringExtensions.isNullOrWhitespace(self._employeeToSave.password)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: password.', data: {} });
			}
			
			let maximumEmployeeId: number = 10000;
			var generateEmployeeId = (): Promise<string> => {
				var employeeId = (Math.floor(Math.random() * maximumEmployeeId) + maximumEmployeeId).toString().substring(1);
				return new Promise<string>((resolve, reject) => {
					self._employeeRepository.employeeIdExists(employeeId)
						.then((employeeIdExists: boolean) => {
							if (!employeeIdExists) {
								resolve(employeeId);
							} else {
								generateEmployeeId()
									.then((employeeId: string) => {
										resolve(employeeId);
									}, (reason: any) => {
										reject(reason);
									})
							}
						}, (reason: any) => {
							reject(reason);
						})
					});
			};

			generateEmployeeId()
				.then((employeeId: string) => {
					self._employeeToSave.employeeId = employeeId;

					var newEmployeeEntity = new EmployeeEntity(self._employeeToSave);
					newEmployeeEntity.save()
						.then((value: string) => {
							resolveToRouter({ status: 201, message: '', data: newEmployeeEntity.toJSON() });
						}, (reason: any) => {
							rejectToRouter({ status: 500, message: reason.message, data: {} });
						})
				}, (reason: any) => {
					rejectToRouter({ status: 500, message: reason.message, data: {} });
				})
        });
	}

    private _employeeToSave: Employee;
    public get employeeToSave (): Employee { return this._employeeToSave; }
    public set employeeToSave (value: Employee) { this._employeeToSave = value; }

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): IEmployeeRepository { return this._employeeRepository; }
	public set employeeRepository (value: IEmployeeRepository) { this._employeeRepository = value; }

    constructor({ employeeToSave = new Employee(), employeeRepository = new EmployeeRepository() }: any = {}) {
        this._employeeToSave = employeeToSave;
        this._employeeRepository = employeeRepository;
    }
}