import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export async function generateAppFile(outputPath: string, models: any[], databaseType: string) {
  const routerImports = models
    .map((model) => `import ${model.name}Router from './routes/${model.name}Router';`)
    .join('\n');

  const routerUses = models
    .map((model) => `app.use('/${model.name.toLowerCase()}', ${model.name}Router);`)
    .join('\n');

  // Read the template file
  const appTemplatePath = path.join(__dirname, 'templates', 'app.ejs');
  const serverTemplatePath = path.join(__dirname, 'templates', 'server.ejs');
  const serverTemplate = fs.readFileSync(serverTemplatePath, 'utf-8');
  const appTemplate = fs.readFileSync(appTemplatePath, 'utf-8');

  // Render the template with data
  const appContent = await ejs.render(appTemplate, {
    routerImports,
    routerUses,
    databaseType,
  });
  const serverContent = await ejs.render(serverTemplate);

  // Write the rendered content to the output file
  const appPath = path.join(outputPath, 'src', 'app.ts');
  fs.writeFileSync(appPath, appContent.trim());
  console.log(`App file created: ${appPath}`);

  const serverPath = path.join(outputPath, 'src', 'server.ts');
  fs.writeFileSync(serverPath, serverContent.trim());
  console.log(`Server file created: ${serverPath}`);
  
}