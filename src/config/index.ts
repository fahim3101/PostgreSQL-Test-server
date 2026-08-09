import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};
