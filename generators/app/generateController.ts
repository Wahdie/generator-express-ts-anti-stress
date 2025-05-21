import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export async function generateControllerFiles(outputPath: string, type: any, model: any) {
  if ( !type) {
    console.error('❌ Invalid schema: missing database type');
    return;
  }

  let templatePath = '';

  if (type === 'sql') {
    templatePath = path.join(__dirname, 'templates/controller', 'controller-sequelize.ejs');
  } else if (type === 'nosql') {
    templatePath = path.join(__dirname, 'templates/controller', 'controller-mongoose.ejs');
  } else {
    console.error('❌ Unknown database type:', type);
    return;
  }

  try {
    const controllerContent = await ejs.renderFile(templatePath, { model }, { async: true });
    const controllerPath = path.join(outputPath, 'src/controllers', `${model.name}Controller.ts`);
    fs.mkdirSync(path.dirname(controllerPath), { recursive: true });
    fs.writeFileSync(controllerPath, controllerContent.trim());
    console.log(`✅ Controller file created: ${controllerPath}`);
  } catch (err) {
    console.error('❌ Error generating controller file:', err);
  }
}
