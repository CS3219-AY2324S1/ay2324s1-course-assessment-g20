export type DatabaseConfiguration = () => {
  databaseOptions: {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  };
};

const databaseConfiguration: DatabaseConfiguration = () => ({
  databaseOptions: {
    host: process.env.SQL_DATABASE_HOST,
    port: process.env.SQL_DATABASE_PORT,
    user: process.env.SQL_DATABASE_USER,
    password: process.env.SQL_DATABASE_PASSWORD,
    database: process.env.SQL_DATABASE_NAME,
  },
});

export default databaseConfiguration;
