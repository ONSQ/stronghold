// Database Initialization - WatermelonDB

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import CheckIn from './models/CheckIn';
import Workout from './models/Workout';

// Create adapter
const adapter = new SQLiteAdapter({
  schema,
  // Optional - for debugging
  // jsi: true, // iOS only
  // onSetUpError: (error) => {
  //   console.error('Database setup error:', error);
  // }
});

// Create database
export const database = new Database({
  adapter,
  modelClasses: [
    CheckIn,
    Workout,
    // Add other models as created
  ],
});

export default database;
