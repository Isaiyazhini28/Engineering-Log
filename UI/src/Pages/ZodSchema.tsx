import { z, ZodRawShape } from "zod";

export const createZodSchema = (fields: []): z.ZodObject<ZodRawShape> => {
  const schema = fields.reduce<ZodRawShape>((acc: any, field: any) => {
    let fieldSchema: any;


    if (field.type === "float" || field.type === "int") {
      fieldSchema = field.hasChild
        ? z.string().optional()
        : z
            .string({required_error:` ${field.fieldName } is mandatory`})
            .min(1, { message: `${field.fieldName } should not be empty` })
            .refine((value) => !isNaN(Number(value)), {
              message:` ${field.fieldName } should be a number`,
            });
    } else if (field.type === "string") {
      fieldSchema = z.string().min(1, { message: `${field.fieldName } should not be empty` });
    
    }

   
    if (field.hasChild && field.childFields?.length > 0) {
      const childSchema: any = createZodSchema(field.childFields);
      fieldSchema = childSchema;
    }

  
    acc[`${field.subFieldId!==null?field.subFieldName+"/"+field.fieldName :field.fieldName }`] = fieldSchema;
    return acc;
  }, {});

  return z.object(schema);
};