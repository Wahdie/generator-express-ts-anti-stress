import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

// Shared type mapping functions
const typeMappers = {
  mapFieldType: (field: any): string => {
    if (!field || typeof field !== 'object') {
      throw new Error(`Invalid field definition`);
    }

    const typeMapping: Record<string, string> = {
      integer: 'number',
      string: 'string',
      boolean: 'boolean',
      Date: 'Date',
      object: 'object',
      array: 'any[]',
      any: 'any', 
    };

    if (field.type === 'enum') {
      if (!field.values || !Array.isArray(field.values)) {
        throw new Error(`Enum field must have a values array`);
      }
      return field.values.map((v: string) => `'${v}'`).join(' | ');
    }

    return typeMapping[field.type] || 'any';
  },

  mapSequelizeType: (field: any): string => {
    const typeMapping: Record<string, string> = {
      integer: 'DataTypes.INTEGER',
      string: 'DataTypes.STRING',
      boolean: 'DataTypes.BOOLEAN',
      Date: 'DataTypes.DATE',
      object: 'DataTypes.JSON',
      array: 'DataTypes.ARRAY(DataTypes.JSON)',
      any: 'DataTypes.JSON',
    };

    if (field.type === 'enum') {
      if (!field.values || !Array.isArray(field.values)) {
        throw new Error(`Enum field must have a values array`);
      }
      return `DataTypes.ENUM(${field.values.map((v: string) => `'${v}'`).join(', ')})`;
    }

    return typeMapping[field.type] || 'DataTypes.STRING';
  },

  mapMongooseType: (field: any): string => {
    const typeMapping: Record<string, string> = {
      integer: 'Number',
      string: 'String',
      boolean: 'Boolean',
      Date: 'Date',
      object: 'Schema.Types.Mixed',
      array: 'Array',
      any: 'Schema.Types.Mixed',
    };

    if (field.type === 'enum') {
      if (!field.values || !Array.isArray(field.values)) {
        throw new Error(`Enum field must have a values array`);
      }
      return `[${field.values.map((v: string) => `'${v}'`).join(', ')}]`;
    }

    return typeMapping[field.type] || 'Schema.Types.String';
  }
};

export async function generateModelFiles(outputPath: string, model: any, dbType: 'sql' | 'nosql') {
  try {
    // Validate inputs
    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('Output path must be a valid string');
    }

    if (!model || typeof model !== 'object') {
      throw new Error('Model must be a valid object');
    }

    if (!model.name || typeof model.name !== 'string') {
      throw new Error('Model must have a valid name property');
    }

    if (!model.fields || typeof model.fields !== 'object') {
      throw new Error('Model must have a fields object');
    }

    if (!['sql', 'nosql'].includes(dbType)) {
      throw new Error('dbType must be either "sql" or "nosql"');
    }

    // Ensure directories exist
    const modelDir = path.join(outputPath, 'src/models');

    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    // Prepare template data
    const templateData = {
      model,
      ...typeMappers,
      dbType
    };

    // Render model file
    const modelTemplatePath = path.join(
      __dirname, 
      'templates/model/', 
      dbType === 'sql' ? 'sequelize/sequelize.ejs' : 'mongoose/mongoose.ejs'
    );

    if (!fs.existsSync(modelTemplatePath)) {
      throw new Error(`Model template not found at ${modelTemplatePath}`);
    }

    const modelContent = await ejs.renderFile(modelTemplatePath, templateData);
    const modelPath = path.join(modelDir, `${model.name}.ts`);
    fs.writeFileSync(modelPath, modelContent.trim());
    console.log(`${dbType === 'sql' ? 'Sequelize' : 'Mongoose'} model file created: ${modelPath} ✅`);

    return { success: true, modelPath };
  } catch (error: any) {
    console.error(`❌ Error generating model files for ${model?.name || 'unknown model'}:`, error.message);
    
    if (error.path) {
      console.error('Template path:', error.path);
    }
    
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
}



