import { promises as fs } from 'fs';
import path from 'path';
import ejs from 'ejs';

type DatabaseConfig = {
  type: 'sql' | 'nosql' ;
  databaseName: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: string;
};

export async function generateDatabaseConfig(outputPath: string, database: DatabaseConfig) {
  
  if (!['sql', 'nosql'].includes(database.type)) {
    throw new Error(`Unsupported database type: ${database.type}`);
  }
  console.log(database);
  database.databaseName =  'my_database';
  database.username =  'root';
  database.password =  '';
  database.host = 'localhost';
  database.port = database.type === 'sql' ? 3306 : 27017;

  const templateFile = `${database.type}.ejs`;
  const templatePath = path.join(__dirname, '../app/templates/database', templateFile);
  const configPath = path.join(outputPath, 'src/config/database.ts');

  const envTemplatePath = path.join(__dirname, '../app/templates', 'env.ejs');
  const envPath = path.join(outputPath, '.env');
  
  const envConfig = {
    DB_TYPE: database.type,
    DB_NAME: database.databaseName,
    DB_USERNAME: database.username,
    DB_PASSWORD: database.password,
    DB_HOST: database.host,
    DB_PORT: database.port,
    DB_DIALECT: database.dialect,
  };


  try {
    const rendered = await ejs.renderFile(templatePath);
    const renderedEnv = await ejs.renderFile(envTemplatePath, { envConfig });
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    
    Promise.all([
      fs.writeFile(configPath, rendered.trim()),
      fs.writeFile(envPath, renderedEnv.trim())
    ]);
    
    console.log(`✅ Database config generated: ${configPath}`);
    console.log(`✅ .env file generated: ${envPath}`);

  } catch (error: any) {
    throw new Error(`Failed to generate config: ${error.message}`);
  }
}