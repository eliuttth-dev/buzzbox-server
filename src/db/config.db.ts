import mysql, { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { readFile } from 'fs/promises';
import winston from 'winston';
import dotenv from 'dotenv';
import fs from "node:fs";
import path from 'path';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT, DB_QUEUE_LIMIT, ENVIRONMENT } = process.env;
const PORT = DB_PORT ? parseInt(DB_PORT) : 3306;

const dbConfig: any = {
  host: DB_HOST,
  user: DB_USER,
  port: PORT,
  password: DB_PASSWORD || '',
  database: DB_NAME,
  connectionLimit: Number(DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: Number(DB_QUEUE_LIMIT) || 0,
  charset: 'utf8mb4',
};

const poll: any = mysql.createPool(dbConfig);

// Removed: check if database exists, because if it does not exists in dbConfig it throws an error,
// because you cannot establish a connection with a database that does not exists, it's an error from
// MYSQL, so does not make sense "check if exists", because if does not exists in first place, you're not
// allowed to interact with the MYSQL schema

// The basic "check" it is literally write the correct database name or create it from MYSQL.
// Or maybe "TODO: remove database:DB_NAME field from dbConfig and check if passed database name
// exists, if exists, everything good, if does not exists, then create it."

// Check environment
if (ENVIRONMENT === 'development') {

  const logFilePath = path.resolve(__dirname, "../../", "logs");
  const logFilename = path.resolve(logFilePath, "database.log");

  (() => {
    try{
      const folderExists = fs.existsSync(logFilePath);
      const fileExists = fs.existsSync(logFilename)
      if(folderExists === undefined) fs.mkdirSync(logFilePath, {recursive: true});
      if(fileExists === undefined) fs.writeFileSync(logFilePath, logFilename, "utf-8"  );
    }catch(error:any){
      console.error(error.message)
    }
  })()


const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: {service: "Database configuration"},
  transports : [new winston.transports.Console(), new winston.transports.File({filename: logFilename})]
})


  // Create dinamically tables based on the <TableName> e.g. Users, Products, Items, etc...
  const tableExists = async (connection: Connection, tableName: string): Promise<boolean> => {
    const query = 'SHOW TABLES LIKE ?';
    const [tables] = await connection.query<RowDataPacket[]>(query, tableName);

    return tables.length > 0;
  };

  // Dinamically resolve the scema creation
  const schemaResolver = async (_path: string) => {
    // Path format: './src/db/dev/01_create_user_table.sql'
    const pathFile: string = path.resolve(process.cwd(), _path);
    const fileToBeReaded: string = await readFile(pathFile, 'utf8');
    return fileToBeReaded && fileToBeReaded;
  };

  // Schema struct paths
  const schemaPaths = {
    createUserTable: './src/db/dev/01_create_user_table.sql',
    populateUserTable: './src/db/dev/02_insert_data_user_table.sql',
  };

  const initializeDatabase = async (): Promise<void> => {
    try {
      const connection: Connection = await createConnection(dbConfig);

      logger.info(`Connected to the database`)

      // Create Users table if does not exists
      const userTableExists = await tableExists(connection, 'Users');

      if (!userTableExists) {
        const createUserSchema = await schemaResolver(schemaPaths.createUserTable);

        await connection.query(createUserSchema);
        logger.info(`Database Updated. Users table created successfully`)

        // Populate tables with test data
        const populateUserSchema = await schemaResolver(schemaPaths.populateUserTable);

        await connection.query(populateUserSchema);
        logger.info(`Database Updated. Table has been populated`)
        
      } else {
        // Populate tables with test data
        const populateUserSchema = await schemaResolver(schemaPaths.populateUserTable);

        await connection.query(populateUserSchema);
        logger.info(`Users table already exists`)
      }

      logger.info(`Schema initialized successfully`);

      await connection.end();
    } catch (err: unknown) {
      console.error('Error initializing the database:', err instanceof Error && err.message);
      logger.error(`Database ${DB_NAME} does not exists.`)
      process.exit(1);
    }
  };

  initializeDatabase();
}

export default poll;
