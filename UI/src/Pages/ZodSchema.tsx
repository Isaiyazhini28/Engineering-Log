import { z } from "zod";



export const createZodSchema = (fields: any[]): z.ZodObject<any> => {
  const schema = fields.reduce((acc: any, field: any) => {
      let fieldSchema: any
      // Determine the Zod schema type based on the field's type
      if (field.type === "float" || field.type === "int") {
          fieldSchema = field.hasChild ?
              z.string().optional() :
              z.string().min(1, { message: `${field.name}  should not be empty` })
                  .refine((val) => !isNaN(Number(val)), {
                      message: `${field.name}  should be a number`,
                  });
      } else if (field.type === "string") {
          fieldSchema = z.string();
      }
      // If the field has child fields, recursively create a schema for them
      if (field.hasChild && field.childFields?.length > 0) {
          const childSchema: any = createZodSchema(field.childFields);
          fieldSchema = childSchema
      }
      // Add the field schema to the accumulator using the field's name
      acc[field.name] = fieldSchema;
      return acc;
  }, {});
  return z.object(schema);
};