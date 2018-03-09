const uuid = require('uuidv4');
import {CommandResponse, IEmployeeRepository} from '../../../types';
import EmployeeEntity from '../../../models/entities/employeeEntity';
import EmployeeRepository from '../../../models/repositories/employeeRepository';

export default class DeleteCommand {
    public execute(): Promise<CommandResponse> {
        var self = this;

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._employeeRepository.get(self._employeeId)
                .then((existingEmployeeEntity: EmployeeEntity | undefined) => {
                    if (existingEmployeeEntity) {
						existingEmployeeEntity
							.delete()
							.then(() => {
                                    resolveToRouter({ status: 200, message: '', data: {} });
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

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): IEmployeeRepository { return this._employeeRepository; }
    public set employeeRepository (value: IEmployeeRepository) { this._employeeRepository = value; }

    constructor({ employeeId = uuid.empty(), employeeRepository = new EmployeeRepository() }: any = {}) {
		this._employeeId = employeeId;
        this._employeeRepository = employeeRepository;
    }
}