const uuid = require('uuidv4');
import { Employee } from '../../../models/types/employee';
import EmployeeEntity from '../../../models/entities/employeeEntity';
import { CommandResponse, IEmployeeRepository } from '../../../types';
import { StringExtensions } from '../../../extensions/StringExtensions';
import EmployeeRepository from '../../../models/repositories/employeeRepository';

export default class UpdateCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            if (StringExtensions.isNullOrWhitespace(self._employeeToSave.firstName)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: first name.', data: {} });
            }
            if (StringExtensions.isNullOrWhitespace(self._employeeToSave.lastName)) {
                rejectToRouter({ status: 422, message: 'Missing or invalid parameter: last name.', data: {} });
            }

            self._employeeRepository.get(self._employeeId)
                .then((existingEmployeeEntity: EmployeeEntity | undefined) => {
                    if (existingEmployeeEntity) {
						existingEmployeeEntity.synchronize(self._employeeToSave);

						existingEmployeeEntity
							.save()
							.then(
                                (value: string) => {
                                    resolveToRouter({ status: 200, message: '', data: existingEmployeeEntity.toJSON() });
								}, (reason: any) => {
                                    rejectToRouter({ status: 500, message: reason.message, data: {} });
								});
                    } else {
                        rejectToRouter({ status: 404, message: 'Employee was not found.', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
    }

    private _employeeId: string;
    public get employeeId (): string { return this._employeeId; }
    public set employeeId (value: string) { this._employeeId = value; }

    private _employeeToSave: Employee;
    public get employeeToSave (): Employee { return this._employeeToSave; }
    public set employeeToSave (value: Employee) { this._employeeToSave = value; }

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): IEmployeeRepository { return this._employeeRepository; }
    public set employeeRepository (value: IEmployeeRepository) { this._employeeRepository = value; }

    constructor({ employeeId = uuid.empty(), employeeToSave = new Employee(), employeeRepository = new EmployeeRepository() }: any = {}) {
		this._employeeId = employeeId;
        this._employeeToSave = employeeToSave;
        this._employeeRepository = employeeRepository;
    }
}