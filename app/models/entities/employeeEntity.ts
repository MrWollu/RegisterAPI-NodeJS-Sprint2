const uuid = require('uuidv4');
const crypto = require('crypto');
import BaseEntity from './baseEntity';
import {Employee} from '../types/employee';
import {DatabaseTableName} from '../constants/databaseTableNames';
import {StringExtensions} from '../../extensions/StringExtensions';
import {EmployeeFieldName} from '../constants/fieldNames/employeeFieldNames';
import {EmployeeClassification} from '../constants/employee/employeeClassification';

export default class EmployeeEntity extends BaseEntity {
    private _employeeId: string;
    public get employeeId (): string { return this._employeeId; }
    public set employeeId (value: string) {
        if (this._employeeId !== value) {
            this._employeeId = value;
            this.propertyChanged(EmployeeFieldName.EMPLOYEE_ID);
        }
    }

    private _firstName: string;
    public get firstName (): string { return this._firstName; }
    public set firstName (value: string) {
        if (this._firstName !== value) {
            this._firstName = value;
            this.propertyChanged(EmployeeFieldName.FIRST_NAME);
        }
    }

    private _lastName: string;
    public get lastName (): string { return this._lastName; }
    public set lastName (value: string) {
        if (this._lastName !== value) {
            this._lastName = value;
            this.propertyChanged(EmployeeFieldName.LAST_NAME);
        }
    }

    private _password: string;
    public get password (): string { return this._password; }
    public set password (value: string) {
        if (this._password !== value) {
            this._password = value;
            this.propertyChanged(EmployeeFieldName.PASSWORD);
        }
    }

    private _active: boolean;
    public get active (): boolean { return this._active; }
    public set active (value: boolean) {
        if (this._active !== value) {
            this._active = value;
            this.propertyChanged(EmployeeFieldName.ACTIVE);
        }
    }

    private _classification: EmployeeClassification;
    public get classification (): EmployeeClassification { return this._classification; }
    public set classification (value: EmployeeClassification) {
        if (this._classification !== value) {
            this._classification = value;
            this.propertyChanged(EmployeeFieldName.CLASSIFICATION);
        }
    }

    private _managerId: string;
    public get managerId (): string { return this._managerId; }
    public set managerId (value: string) {
        if (this._managerId !== value) {
            this._managerId = value;
            this.propertyChanged(EmployeeFieldName.MANAGER_ID);
        }
    }

    public toJSON(): Employee {
        return new Employee(
            super.id,
			this._employeeId,
			this._firstName,
			this._lastName,
			StringExtensions.EMPTY,
			this._active,
			this._classification,
			this._managerId,
            super.createdOn);
    }

    public fillFromRecord(row: any): void {
        super.fillFromRecord(row);

		this._employeeId = row[EmployeeFieldName.EMPLOYEE_ID];
		this._firstName = row[EmployeeFieldName.FIRST_NAME];
		this._lastName = row[EmployeeFieldName.LAST_NAME];
		this._password = row[EmployeeFieldName.PASSWORD];
		this._active = row[EmployeeFieldName.ACTIVE];
        this._classification = row[EmployeeFieldName.CLASSIFICATION];
		this._managerId = row[EmployeeFieldName.MANAGER_ID];
    }

    protected fillRecord(): any {
        var record: any = super.fillRecord();

        record[EmployeeFieldName.EMPLOYEE_ID] = this._employeeId;
        record[EmployeeFieldName.FIRST_NAME] = this._firstName;
        record[EmployeeFieldName.LAST_NAME] = this._lastName;
        record[EmployeeFieldName.PASSWORD] = this._password;
        record[EmployeeFieldName.ACTIVE] = this._active;
        record[EmployeeFieldName.CLASSIFICATION] = this._classification;
        record[EmployeeFieldName.MANAGER_ID] = this._managerId;
        
        return record;
	}
	
    public synchronize(employeeRequest: Employee): void {
        this.active = (employeeRequest.active || false);
        this.lastName = (employeeRequest.lastName || '');
        this.firstName = (employeeRequest.firstName || '');
        this.managerId = (employeeRequest.managerId || uuid.empty());
		this.classification = (employeeRequest.classification || EmployeeClassification.NOT_DEFINED);
		if (!StringExtensions.isNullOrWhitespace(employeeRequest.password)) {
			this.password = EmployeeEntity.hashPassword(employeeRequest.password);
		}

		employeeRequest.id = super.id;
		employeeRequest.createdOn = super.createdOn;
		employeeRequest.employeeId = this._employeeId;
		employeeRequest.password = StringExtensions.EMPTY;
    }

    public static hashPassword(password: string): string {
		const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    constructor(employeeRequest?: Employee) {
        super(employeeRequest, DatabaseTableName.EMPLOYEE);

		this._active = (employeeRequest ? employeeRequest.active : false);
		this._lastName = (employeeRequest ? employeeRequest.lastName : '');
		this._firstName = (employeeRequest ? employeeRequest.firstName : '');
        this._employeeId = (employeeRequest ? employeeRequest.employeeId : '');
		this._managerId = (employeeRequest ? employeeRequest.managerId : uuid.empty());
		this._password = (employeeRequest ? EmployeeEntity.hashPassword(employeeRequest.password) : '');
		this._classification = (employeeRequest ? employeeRequest.classification : EmployeeClassification.NOT_DEFINED);
    }
}