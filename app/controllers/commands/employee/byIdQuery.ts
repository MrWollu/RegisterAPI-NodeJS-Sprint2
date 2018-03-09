const uuid = require('uuidv4');
import EmployeeEntity from '../../../models/entities/employeeEntity';
import { CommandResponse, IEmployeeRepository } from '../../../types';
import EmployeeRepository from '../../../models/repositories/employeeRepository';

export default class ByIdQuery {
    public execute(): Promise<CommandResponse> {
        var self = this;
        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._employeeRepository.get(self._id)
                .then((employeeEntity: EmployeeEntity | undefined) => {
                    if (employeeEntity) {
                        resolveToRouter({ status: 200, message: '', data: employeeEntity.toJSON() });
                    } else {
                        rejectToRouter({ status: 404, message: 'Employee was not found.', data: {} });
                    }
                }, (reason: any) => {
                    rejectToRouter({ status: 500, message: reason.message, data: {} });
                })
        });
    }

    private _id: string;
    public get id (): string { return this._id; }
    public set id (value: string) { this._id = value; }

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): any { return this._employeeRepository; }
    public set employeeRepository (value: any) { this._employeeRepository = value; }

    constructor({ id = uuid.empty(), employeeRepository = new EmployeeRepository() }: any = {}) {
        this._id = id;
        this._employeeRepository = employeeRepository;
    }
}