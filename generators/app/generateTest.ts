// import fs from 'fs';
// import path from 'path';
// import ejs from 'ejs';

// export function generateTests(outputPath: string, schema: any) {
//   const models = schema.models || [];

//   models.forEach((model: any) => {
//       const modelFields = model.fields.map(field => ({
//             name: field.name,
//             fakeValue: generateFakeValue(field.type),
//             updatedFakeValue: generateFakeValue(field.type) // berbeda nilainya
//       }));

//     const testContent = ejs.render(
//       fs.readFileSync(path.join(__dirname, 'templates/test/controller.sequelize.ejs'), 'utf-8'),
//       { modelName: model.name, modelFields },
//     );

//     const testDir = path.join(outputPath, 'tests', 'controllers');
//     fs.mkdirSync(testDir, { recursive: true });

//     fs.writeFileSync(path.join(testDir, `${model.name.toLowerCase()}.test.ts`), testContent);
//   });
// }

// export function generateFakeValue(type: string): string | number | boolean {
//   switch (type) {
//     case 'string': return `"test_${Math.random().toString(36).substring(2)}"`;
//     case 'number': return Math.floor(Math.random() * 100);
//     case 'boolean': return true;
//     default: return `"unknown"`;
//   }
// }



import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function generateTests(outputPath: string, models: any[]) {
  const templatePath = path.resolve(__dirname, 'templates/controllerTest.ejs');
  const testDir = path.join(outputPath, 'test/controllers');

  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  models.forEach(model => {
    const modelName = model.name;
    const filePath = path.join(testDir, `${modelName}.test.ts`);
    const examplePayload = generateExamplePayload(model.fields);
    const exampleUpdatePayload = generateExampleUpdatePayload(model.fields);

    const rendered = ejs.render(
      fs.readFileSync(templatePath, 'utf-8'),
      { modelName, examplePayload, exampleUpdatePayload }
    );

    fs.writeFileSync(filePath, rendered);
  });
}

function generateExamplePayload(fields: any) {
  const result: Record<string, any> = {};
  fields.forEach((f: any) => {
    result[f.name] = getMockValue(f.type);
  });
  return result;
}

function generateExampleUpdatePayload(fields: any) {
  const result: Record<string, any> = {};
  fields.forEach((f: any) => {
    if (f.name !== 'id' && f.name !== '_id') {
      result[f.name] = getMockValue(f.type, true);
    }
  });
  return result;
}

function getMockValue(type: string, isUpdate = false) {
  switch (type) {
    case 'string': return isUpdate ? 'updated_value' : 'test_value';
    case 'number': return isUpdate ? 2 : 1;
    case 'boolean': return true;
    case 'date': return new Date().toISOString();
    default: return 'value';
  }
}
