import dotenv, { populate } from 'dotenv';
import mysql, { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { readFile } from 'fs/promises';
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

// Check environment
if (ENVIRONMENT === 'development') {
  // Verify if DB exists
  const databaseExists = async (connection: Connection, dbName: string): Promise<boolean> => {
    const query = `SHOW DATABASES LIKE ?`;
    const [databases] = await connection.query<RowDataPacket[]>(query, dbName);

    return databases.length > 0;
  };

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

      console.log('Connected to the database server');

      // Check if database exists
      let dbExists;
      if (DB_NAME) {
        dbExists = await databaseExists(connection, DB_NAME);
      }

      if (!dbExists) {
        // Create database if does not exists
        console.log(`Database "${DB_NAME}" does not exists. Creating...`);
        await connection.query('CREATE DATABASE ??', [DB_NAME]);
        console.log(`Database "${DB_NAME}" created successfully`);
      } else {
        console.log(`Database "${DB_NAME}" already exists`);
      }

      console.log('Initializing schema from schema.sql...');

      // Create Users table if does not exists
      const userTableExists = await tableExists(connection, 'Users');

      if (!userTableExists) {
        const createUserSchema = await schemaResolver(schemaPaths.createUserTable);

        await connection.query(createUserSchema);
        console.log(`Database Updated. Users table created successfully`);

        // Populate tables with test data
        const populateUserSchema = await schemaResolver(schemaPaths.populateUserTable);

        await connection.query(populateUserSchema);
        console.log(`Database Updated. Table has been populated`);
      } else {
        // Populate tables with test data
        const populateUserSchema = await schemaResolver(schemaPaths.populateUserTable);

        await connection.query(populateUserSchema);
        console.log(`Users table already exists`);
      }

      console.log('Schema initialized successfully');
      await connection.end();
    } catch (err: unknown) {
      console.error('Error initializing the database:', err instanceof Error ? err.message : err);
      console.log('\n\n', err);
      process.exit(1);
    }
  };

  initializeDatabase();
}

export default poll;
