export const JWT_CONSTANTS = {
  secret: (process.env.JWT_SECRET || ('secret' as string)) as string,
};
