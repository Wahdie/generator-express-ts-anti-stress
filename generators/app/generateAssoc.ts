import { promises as fs } from 'fs';
import path from 'path';
import ejs from 'ejs';

export async function generateAssociationFile(outputPath: string, models: any[]) {
  const templatePath = path.join(__dirname, 'templates/model/sequelize', 'association.ejs');
  const targetPath = path.join(outputPath, 'src/models', 'associations.ts');

  const template = await fs.readFile(templatePath, 'utf-8');
  const rendered = ejs.render(template, { models });

  await fs.mkdir(path.dirname(targetPath), { recursive: true }); // buat folder jika belum ada
  await fs.writeFile(targetPath, rendered);
}
