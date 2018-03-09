const uuid = require('uuidv4');
import EmployeeEntity from '../../../models/entities/employeeEntity';
import { CommandResponse, IEmployeeRepository } from '../../../types';
import EmployeeRepository from '../../../models/repositories/employeeRepository';
import { ActiveEmployeeCounts } from '../../../models/types/activeEmployeeCounts';
import { EmployeeClassification } from '../../../models/constants/employee/employeeClassification';

export default class ActiveCountsQuery {
    public execute(): Promise<CommandResponse> {
		return ((this._classification === EmployeeClassification.NOT_DEFINED)
			? this.queryAllActiveCounts()
			: this.queryActiveCountsByClassification());
	}
	
	private queryActiveCountsByClassification(): Promise<CommandResponse> {
		var self = this;
		var activeEmployeeCounts: ActiveEmployeeCounts = new ActiveEmployeeCounts();

        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._employeeRepository.activeCountByClassification(self._classification)
                .then((activeCount: number) => {
					if (self._classification === EmployeeClassification.CASHIER) {
						activeEmployeeCounts.activeCashierCount = activeCount;
					} else if (self._classification === EmployeeClassification.SHIFT_MANAGER) {
						activeEmployeeCounts.activeShiftManagerCount = activeCount;
					} else if (self._classification === EmployeeClassification.GENERAL_MANAGER) {
						activeEmployeeCounts.activeGeneralManagerCount = activeCount;
					}

					resolveToRouter({ status: 200, message: '', data: activeEmployeeCounts });
				}, (reason: any) => {
					rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
	}
	
	private queryAllActiveCounts(): Promise<CommandResponse> {
		var self = this;
		var activeEmployeeCounts: ActiveEmployeeCounts = new ActiveEmployeeCounts();

		// Obviously this nested approach is not ideal as it is not extensible at all. Imagine if
		//the company had to add 3 new employee types. Generally it would be better to run a
		//single query, probably using a GROUP BY clause, to count all records by classification.
		// That, or approach the solution differently. :-)
        return new Promise<CommandResponse>((resolveToRouter, rejectToRouter) => {
            self._employeeRepository.activeCountByClassification(EmployeeClassification.CASHIER)
                .then((activeCashierCount: number) => {
					activeEmployeeCounts.activeCashierCount = activeCashierCount;

					self._employeeRepository.activeCountByClassification(EmployeeClassification.SHIFT_MANAGER)
						.then((activeShiftManagerCount: number) => {
							activeEmployeeCounts.activeShiftManagerCount = activeShiftManagerCount;

							self._employeeRepository.activeCountByClassification(EmployeeClassification.GENERAL_MANAGER)
								.then((activeGeneralManagerCount: number) => {
									activeEmployeeCounts.activeGeneralManagerCount = activeGeneralManagerCount;

									resolveToRouter({ status: 200, message: '', data: activeEmployeeCounts });
								}, (reason: any) => {
									rejectToRouter({ status: 500, message: reason.message, data: {} });
								});
						}, (reason: any) => {
							rejectToRouter({ status: 500, message: reason.message, data: {} });
						});
				}, (reason: any) => {
					rejectToRouter({ status: 500, message: reason.message, data: {} });
                });
        });
	}

    private _classification: EmployeeClassification;
    public get classification (): EmployeeClassification { return this._classification; }
    public set classification (value: EmployeeClassification) { this._classification = value; }

    private _employeeRepository: IEmployeeRepository;
    public get employeeRepository (): any { return this._employeeRepository; }
    public set employeeRepository (value: any) { this._employeeRepository = value; }

    constructor({ classification = EmployeeClassification.NOT_DEFINED, employeeRepository = new EmployeeRepository() }: any = {}) {
		this._classification = classification;
        this._employeeRepository = employeeRepository;
    }
}