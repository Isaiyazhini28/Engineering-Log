import { z, ZodRawShape } from "zod";

export const createZodSchema = (fields: []): z.ZodObject<ZodRawShape> => {
  const schema = fields.reduce<ZodRawShape>((acc: any, field: any) => {
    let fieldSchema: any;


    if (field.type === "float" || field.type === "int") {
      fieldSchema = field.hasChild
        ? z.string().optional()
        : z
            .string({required_error:` ${field.name} is mandatory`})
            .min(1, { message: `${field.name} should not be empty` })
            .refine((value) => !isNaN(Number(value)), {
              message:` ${field.name} should be a number`,
            });
    } else if (field.type === "string") {
      fieldSchema = z.string().min(1, { message: `${field.name} should not be empty` });
    
    }

   
    if (field.hasChild && field.childFields?.length > 0) {
      const childSchema: any = createZodSchema(field.childFields);
      fieldSchema = childSchema;
    }

  
    acc[`${field.name}`] = fieldSchema;
    return acc;
  }, {});

  return z.object(schema);
};