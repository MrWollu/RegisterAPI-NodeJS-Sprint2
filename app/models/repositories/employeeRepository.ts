import BaseRepository from './baseRepository';
import { IEmployeeRepository } from '../../types';
import WhereClause from './helpers/where/WhereClause';
import EmployeeEntity from '../entities/employeeEntity';
import WhereContainer from './helpers/where/WhereContainer';
import { SQLComparison } from '../constants/sql/comparisons';
import { SQLConditional } from '../constants/sql/conditionals';
import { DatabaseTableName } from '../constants/databaseTableNames';
import { EmployeeFieldName } from '../constants/fieldNames/employeeFieldNames';
import { EmployeeClassification } from '../constants/employee/employeeClassification';

export default class EmployeeRepository extends BaseRepository<EmployeeEntity> implements IEmployeeRepository {
	public employeeIdExists(employeeId: string): Promise<boolean> {
		return this.existsWhere({
			whereContainer: new WhereContainer({
				whereClauses: [
					new WhereClause({
						tableName: this.tableName
						, fieldName: EmployeeFieldName.EMPLOYEE_ID
						, comparison: SQLComparison.EQUALS
					})
				]
			})
			, values: { [this.tableName + EmployeeFieldName.EMPLOYEE_ID]: employeeId }
		});
	}

	public byEmployeeId(employeeId: string): Promise<EmployeeEntity | undefined> {
		return this.firstOrDefaultWhere({
			whereContainer: new WhereContainer({
				whereClauses: [
					new WhereClause({
						tableName: this.tableName
						, fieldName: EmployeeFieldName.EMPLOYEE_ID
						, comparison: SQLComparison.EQUALS
					})
				]
			})
			, values: { [this.tableName + EmployeeFieldName.EMPLOYEE_ID]: employeeId }
		});
	}

	public activeCountByClassification(employeeClassification: EmployeeClassification): Promise<number> {
		return this.countWhere({
			whereContainer: new WhereContainer({
				whereClauses: [
					new WhereClause({
						tableName: this.tableName
						, fieldName: EmployeeFieldName.CLASSIFICATION
						, comparison: SQLComparison.EQUALS
					})
					, new WhereClause({
						conditional: SQLConditional.AND
						, tableName: this.tableName
						, fieldName: EmployeeFieldName.ACTIVE
						, comparison: SQLComparison.EQUALS
					})
				]
			})
			, values: {
				[this.tableName + EmployeeFieldName.CLASSIFICATION]: employeeClassification
				, [this.tableName + EmployeeFieldName.ACTIVE]: true
			}
		});
	}

    protected createOne(row: any): EmployeeEntity {
        var entity = new EmployeeEntity();
        entity.fillFromRecord(row);
        return entity;
    }

    constructor() {
        super(DatabaseTableName.EMPLOYEE);
    }
}