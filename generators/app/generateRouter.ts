import fs from 'fs';
import path from 'path';
import ejs from 'ejs';


export async function generateRouteFiles(outputPath: string, model: any) {
      
      const templatePath = path.join(__dirname, 'templates/router', 'router.ejs');
      const template = fs.readFileSync(templatePath, 'utf-8');

      //Render the template with data
      const routeContent = await ejs.renderFile(templatePath, { model: model });

      const routePath = path.join(outputPath, 'src/routes', `${model.name}Router.ts`);
      fs.writeFileSync(routePath, routeContent.trim());
      console.log(`Route file created: ${routePath} ✅ `);
}
