const uuid = require('uuidv4');
import * as moment from 'moment';
import {MappedEntityBaseType} from './mappedEntityBaseType';
import {EmployeeClassification} from '../constants/employee/employeeClassification';

export class Employee extends MappedEntityBaseType {
    constructor(
        public id: string = uuid.empty(),
        public employeeId: string = '',
        public firstName: string = '',
        public lastName: string = '',
        public password: string = '',
        public active: boolean = false,
        public classification: EmployeeClassification = EmployeeClassification.NOT_DEFINED,
        public managerId: string = uuid.empty(),
        public createdOn: moment.Moment = moment()) {
            super(id, createdOn);
    }
}