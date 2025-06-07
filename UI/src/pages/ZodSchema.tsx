import { z, ZodRawShape } from "zod";

export const createZodSchema = (fields: []): z.ZodObject<ZodRawShape> => {
  const schema = fields.reduce<ZodRawShape>((acc: any, field: any) => {
    let fieldSchema: any;

    if (field.type === "float" || field.type === "int") {
      fieldSchema = field.hasChild
        ? z.string().optional()
        : z
            .string({ required_error: ` ${field.subFieldId === null
              ? field.fieldName:field.subFieldName} is mandatory` })
            .min(1, { message: `${field.subFieldId === null
              ? field.fieldName:field.subFieldName} should not be empty` })
            .refine((value) => !isNaN(Number(value)), {
              message: ` ${field.subFieldId === null
                ? field.fieldName:field.subFieldName} should be a number`,
            });
    } else if (field.type === "string") {
      fieldSchema = z
        .string()
        .min(1, { message: `${field.subFieldId === null
          ? field.fieldName:field.subFieldName} should not be empty` });
    }

    acc[
      `${
        field.subFieldId !== null
          ? field.subFieldName + "/" + field.fieldName
          : field.fieldName
      }`
    ] = fieldSchema;
    return acc;
  }, {});

  return z.object(schema);
};

export const ReadingSubmitSchema = z.object({
  comment: z.string().min(1, { message: `comment should not be empty` }),
});

export type SubmitFormType=z.infer<typeof ReadingSubmitSchema>;
