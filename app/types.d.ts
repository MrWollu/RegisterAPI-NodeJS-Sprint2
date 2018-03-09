import BaseEntity from './models/entities/baseEntity';
import ProductEntity from './models/entities/productEntity';
import EmployeeEntity from './models/entities/employeeEntity';
import { EmployeeClassification } from './models/constants/employee/employeeClassification';

export interface Config {
  name: string;
  port: number;
  env: string;
  version: string;
  db: DBConfig;
}

export interface DBConfig {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string
}

export interface CommandResponse {
  status: number,
  message: string,
  data: any
}

export interface IBaseRepository<T extends BaseEntity> {
  get(id: string): Promise<T | undefined>;
  all(): Promise<T[]>;
  exists(id: string): Promise<boolean>;
  inRange(limit: number, offset: number): Promise<T[]>;
  saveMany(toSave: T[]): Promise<null>;
  deleteMany(toDelete: T[]): Promise<null>;
  connectAndRun(context: T, action: (self: T, connection: any) => Promise<any>): Promise<any>;
}

export interface IProductRepository extends IBaseRepository<ProductEntity> {
  byLookupCode(lookupCode: string): Promise<ProductEntity | undefined>;
}

export interface IEmployeeRepository extends IBaseRepository<EmployeeEntity> {
  employeeIdExists(employeeId: string): Promise<boolean>;
  byEmployeeId(employeeId: string): Promise<EmployeeEntity | undefined>;
  activeCountByClassification(employeeClassification: EmployeeClassification): Promise<number>;
}
