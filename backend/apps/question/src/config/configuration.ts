import { DatabaseConfigurationOptions } from '@app/sql-database';
import { getDatabaseConfigurationForService } from '@app/sql-database/config/databaseConfiguration';
import { Service } from '@app/interservice-api/services';

const questionConfiguration = () => {
  const databaseConfigurationOptions: DatabaseConfigurationOptions =
    getDatabaseConfigurationForService(Service.QUESTION_SERVICE);

  return {
    port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
    databaseConfigurationOptions,
  };
};

export default questionConfiguration;
