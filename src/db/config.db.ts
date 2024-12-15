import dotenv from 'dotenv';
import mysql, { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import { readFile } from 'fs/promises';
import path from 'path';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT, DB_QUEUE_LIMIT, ENVIRONMENT } = process.env;

// Check environment
if (ENVIRONMENT !== 'development') {
  console.error('This script is intended for development only. Exiting...');
  process.exit(1);
}

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: Number(DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: Number(DB_QUEUE_LIMIT) || 0,
  charset: 'utf8mb4',
};

const poll: any = mysql.createPool(dbConfig);

const databaseExists = async (connection: Connection, dbName: string): Promise<boolean> => {
  const query = `SHOW DATABASES LIKE ?`;
  const [databases] = await connection.query<RowDataPacket[]>(query, dbName);

  return databases.length > 0;
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
      console.log(`Database "${DB_NAME}" already exists. Resetting Schema...`);
    }

    console.log('Initializing schema from schema.sql...');

    const schemaPath: string = path.resolve(process.cwd(), './src/db/schema.sql');
    const schema: string = await readFile(schemaPath, 'utf8');

    await connection.query(schema);

    console.log('Schema initialized successfully');

    await connection.end();
  } catch (err: unknown) {
    console.error('Error initializing the database:', err instanceof Error ? err.message : err);
    console.log('\n\n', err);
    process.exit(1);
  }
};

initializeDatabase();

export default poll;
