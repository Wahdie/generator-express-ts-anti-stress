import fs from 'fs';
import path from 'path';
import { generateDatabaseConfig } from './generateDatabaseConfig';
import { generateModelFiles } from './generateModel';
import { generateControllerFiles } from './generateController';
import { generateRouteFiles } from './generateRouter';
import { generateAppFile } from './generateApp';
import { generateAssociationFile } from './generateAssoc';
import { generateMiddlewareFiles } from './generateMiddleware';
import { generateTests } from './generateTest';

export function createProjectStructure(outputPath: string, schema: any) {
  const resolvedOutputPath = path.resolve(outputPath);

  // Ensure output directory exists
  if (!fs.existsSync(resolvedOutputPath)) {
    fs.mkdirSync(resolvedOutputPath, { recursive: true });
  }
  
  // Create base folders
  const folders = ['src/controllers', 'src/models', 'src/routes', 'src/views', 'src/config', 'src/middlewares'];
  
  folders.forEach((folder) => {
    const fullPath = path.join(resolvedOutputPath, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('Project structure created.');
  
  // Simpan semua model untuk digunakan dalam generateAppFile
  const models: any[] = [];
  // Generate database configuration
  generateDatabaseConfig(resolvedOutputPath, schema.database);
  // Generate files based on schema
  schema.models.forEach((model: any) => {
    generateModelFiles(resolvedOutputPath, model, schema.database.type);
    generateControllerFiles(resolvedOutputPath, schema.database.type, model);
    generateRouteFiles(resolvedOutputPath, model);
    generateTests(resolvedOutputPath, model);
    models.push(model);
    
  });

  if (schema.database.type === 'sql') {
    generateAssociationFile(resolvedOutputPath, models); 
  }

  generateAppFile(resolvedOutputPath, models, schema.database.type); // Generate app.ts and server.ts
  generateMiddlewareFiles(resolvedOutputPath); // Generate middleware files

  console.log('Files generated successfully! ✅');
}
