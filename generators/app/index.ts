import Generator from 'yeoman-generator';
import fs from 'fs';
import path from 'path';
import { createProjectStructure } from './generator';
import Ajv from 'ajv';
import projectSchema from './projectSchema'; // Import your JSON schema

interface ProjectAnswers {
  projectName: string;
  schemaPath: string;
  projectStructure: string;
  databaseDialect: string;
}


export default class AppGenerator extends Generator {
  private answers!: ProjectAnswers;
  private schemaData!: string;
  private schemaObject!: any;



  async prompting() {
    this.answers = await this.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name: ',
      default: 'my-express-app',
    },
    {
      type: 'input',
      name: 'schemaPath',
      message: 'Path to JSON schema: ',
      default: 'schema.json',
    },
    {
      type: 'list',
      name: 'projectStructure',
      message: 'Project structure: ',
      choices: ['MVC Pattern', 'Repository Pattern'],
      default: 'MVC Pattern',
    },
    {
      type: 'list',
      name: 'databaseDialect',
      message: 'Database dialect:',
      choices: ['postgresql', 'mysql', 'sqlite', 'mongodb'],
      default: 'mysql',
    },
  ]);

  }



  private validateSchemaPath(): boolean {
    const schemaFullPath = path.resolve(this.answers.schemaPath);
    if (!fs.existsSync(schemaFullPath)) {
      this.log.error(`Schema file not found: ${schemaFullPath}`);
      return false;
    }

    this.schemaData = fs.readFileSync(schemaFullPath, 'utf-8');
    const parsedSchema = JSON.parse(this.schemaData);

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(projectSchema);

    const valid = validate(parsedSchema);

    if (!valid) {
      this.log.error('❌ Schema validation failed:');
      validate.errors?.forEach(err => {
        this.log.error(`- ${err.instancePath} ${err.message}`);
      });
      return false;
    }

    return true;
  }

  private initializeProjectStructure() {
    const { projectName } = this.answers;
    const outputPath = this.destinationPath(projectName);
    const schema = JSON.parse(this.schemaData);

    if (this.answers.databaseDialect === 'postgresql' || this.answers.databaseDialect === 'sqlite' || this.answers.databaseDialect === 'mysql') {
      schema.database = {
        type: 'sql',
        dialect: this.answers.databaseDialect
      }
    } else if (this.answers.databaseDialect === 'mongodb') {
      schema.database = {
        type: 'nosql',
        dialect: this.answers.databaseDialect
      }
    }

    this.schemaObject = schema; // <- SIMPAN DI INSTANCE

    this.log('Generating project structure...');
    createProjectStructure(outputPath, schema);
  }

  // private initializeProjectStructure() {
  //   const { projectName } = this.answers;
  //   const outputPath = this.destinationPath(projectName);
  //   const schema = JSON.parse(this.schemaData);

  //   if (this.answers.databaseDialect === 'postgresql' || this.answers.databaseDialect === 'sqlite' || this.answers.databaseDialect === 'mysql') {
  //     schema.database = {
  //       type : 'sql',
  //       dialect : this.answers.databaseDialect
  //     }
  //   } else if (this.answers.databaseDialect === 'mongodb') {
  //     schema.database = {
  //       type : 'nosql',
  //       dialect : this.answers.databaseDialect
  //     }
  //   }
    
  //   this.log('Generating project structure... ');
  //   createProjectStructure(outputPath, schema);
  // }

  private configurePackageJson() {
      
    const { projectName } = this.answers;
    const projectPath = this.destinationPath(projectName);
    
    
    // Initialize package.json
    this.spawnCommandSync('npm', ['init', '-y'], { cwd: projectPath });
    const packageJsonPath = path.join(projectPath, 'package.json');
  
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
    packageJson.main = "src/app.ts";
    packageJson.types = "src/app.d.ts";
    packageJson.scripts = {
      start: 'node dist/server.js',
      dev: 'nodemon src/server.ts',
      build: 'tsc',
      lint: 'eslint "src/**/*.ts"',
      prettier: 'prettier --write "src/**/*.ts"',
      format: 'npm run prettier && npm run lint',
      test: "jest"
    };
  
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  private installDependencies() {
    const { projectName } = this.answers;
    const projectPath = this.destinationPath(projectName);
    // const schema = JSON.parse(this.schemaData);
    const schema = this.schemaObject;

  
    const dependencies = [
      'express', 'dotenv', 'cors', 'body-parser', 'morgan', 'winston'
    ];
  
    const devDependencies = [
      'typescript', 'ts-node', '@types/node', '@types/express',
      'nodemon', 'eslint', 'prettier', '@types/morgan', '@eslint/js', 'globals', 'typescript-eslint', 'jest', 'ts-jest', '@types/jest', 'supertest', '@types/supertest'
    ];
  
    // Tambahkan database-specific dependencies
    if (schema.database.type === 'sql') {
      dependencies.push('sequelize', 'mysql2'); // Bisa diganti sesuai dialect
    } else if (schema.database?.type === 'nosql') {
      dependencies.push('mongoose');
    }
  
    // Sekali install dependencies
    console.log('Installing dependencies...');
    this.spawnCommandSync('npm', ['install', ...dependencies], { cwd: projectPath });
  
    // Sekali install devDependencies
    console.log('Installing devDependencies...');
    this.spawnCommandSync('npm', ['install', '--save-dev', ...devDependencies], { cwd: projectPath });
  }
  
  private configureTooling() {
    const { projectName } = this.answers;
    const projectPath = this.destinationPath(projectName);


    // Copy configuration files
    const configFiles = [
      { template: 'nodemon.ejs', output: 'nodemon.json' },
      { template: 'eslintrc.ejs', output: '.eslintrc.js' },
      { template: 'tsconfig.ejs', output: 'tsconfig.json' },
      { template: 'prettierrc.ejs', output: '.prettierrc' }
    ];

    configFiles.forEach(({ template, output }) => {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(`${projectName}/${output}`),
        { projectName }
      );
    });
  }

  async writing() {
    // if (!this.validateSchemaPath()) return;
    if (!this.validateSchemaPath()) {
      const answer = await this.prompt({
        type: 'confirm',
        name: 'continueAnyway',
        message: 'Schema invalid. Do you want to continue with default values?',
        default: false
      });

      if (!answer.continueAnyway) {
        this.log('🛑 Generation aborted.');
        process.exit(1);
      }
    }

    this.initializeProjectStructure();
    this.configurePackageJson();
    this.configureTooling();
    this.log('✅ Project structure and configuration files created successfully!');
  }


  install() {
    this.installDependencies();
    this.log('✅ All dependencies installed successfully!');
  }
}