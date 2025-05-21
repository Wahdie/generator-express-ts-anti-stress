import { promises as fs } from 'fs';
import path from 'path';
import ejs from 'ejs';



export async function generateMiddlewareFiles(outputPath: string) {
  const templatePath = path.join(__dirname, 'templates/middleware', 'errorHandler.ejs');
  const targetPath = path.join(outputPath, 'src/middlewares', 'errorHandler.ts');

  const template = await fs.readFile(templatePath, 'utf-8');
  const rendered = await ejs.render(template);

  await fs.mkdir(path.dirname(targetPath), { recursive: true }); // buat folder jika belum ada
  await fs.writeFile(targetPath, rendered);
}