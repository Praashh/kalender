
const JWT_SECRET = process.env.JWT_SECRET as string;
const SALT = process.env.SALT as string;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET 
  ) {
    throw new Error(
      'Missing environment variables for authentication providers',
    );
  }

export {
    JWT_SECRET,
    SALT,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
}