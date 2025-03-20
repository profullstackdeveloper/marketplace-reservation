import { DataSource } from "typeorm";
import { PostgreOptions } from "./postgres/config";

export const dataSource = new DataSource(PostgreOptions);

dataSource.initialize().then(() => {console.log("connected")})
