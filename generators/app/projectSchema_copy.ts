const projectSchema = {
  type: "object",
  required: ["models"],
  properties: {
    projectName: { type: "string" },
    database: {
      type: "object",
      required: ["type", "host", "port", "username", "password", "databaseName"],
      properties: {
        type: { enum: ["sql", "nosql"] },
        host: { type: "string" },
        port: { type: "number" },
        username: { type: "string" },
        password: { type: "string" },
        databaseName: { type: "string" }
      }
    },
    templatingEngine: { type: "string" },
    models: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "fields"],
        properties: {
          name: { type: "string" },
          fields: {
            type: "object",
            minProperties: 1,
            additionalProperties: {
              type: "object",
              required: ["type"],
              properties: {
                type: { type: "string" },
                required: { type: "boolean" },
                unique: { type: "boolean" },
                primaryKey: { type: "boolean" },
                autoIncrement: { type: "boolean" },
                foreignKey: { type: "boolean" },
                references: { type: "string" },
                onDelete: { type: "string" },
                onUpdate: { type: "string" }
              }
            }
          },
          relations: {
            type: "object",
            additionalProperties: {
              type: "object",
              required: ["type", "model"],
              properties: {
                type: { type: "string" },
                model: { type: "string" },
                cascadeDelete: { type: "boolean" }
              }
            }
          }
        }
      }
    }
  }
};

export default projectSchema;
