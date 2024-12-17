import mysql from 'mysql2/promise';
import pool from '../db/config.db';
import { User } from '../interfaces/user.interface';

export const createNewUser = async (data: User) => {
  let connection;

  try {
    connection = await pool.getConnection();
    // Check if user exists
  } catch (err) {
  } finally {
    if (connection) connection.release;
  }
};
