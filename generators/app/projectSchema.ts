const projectSchema = {
  type: "object",
  required: ["models"],
  properties: {
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
