import { z } from "zod";
import { ArrayType, HT_Yard_Array } from "@/lib/ht-yard-array";

export const createDynamicSchema = (fields: ArrayType[]) => {
  const schemaShape = fields.reduce((acc, field) => {
    // Validate the main input field
    acc[`${field.Fieldname}_1`] = z
      .string()
      .min(1, { message: `${field.Fieldname}  should not be empty` })
      .refine((val) => !isNaN(Number(val)), {
        message: `${field.Fieldname}  should be a number`,
      });

    // Validate the second input field
    acc[`${field.Fieldname}_2`] = z
      .string()
      .min(1, { message: `${field.Fieldname} should not be empty` })
      .refine((val) => !isNaN(Number(val)), {
        message: `${field.Fieldname}  should be a number`,
      });

    // Validate the third input field
    acc[`${field.Fieldname}_3`] = z
      .string()
      .min(1, { message: `${field.Fieldname} should not be empty` })
      .refine((val) => !isNaN(Number(val)), {
        message: `${field.Fieldname} should be a number`,
      });

    // Validate child fields if any
    if (field.child) {
      field.child.forEach((childField) => {
        acc[`${field.Fieldname}.${childField.Fieldname}_1`] = z
          .string()
          .min(1, { message: `${childField.Fieldname} should not be empty` })
          .refine((val) => !isNaN(Number(val)), {
            message: `${childField.Fieldname} should be a number`,
          });

        acc[`${field.Fieldname}.${childField.Fieldname}_2`] = z
          .string()
          .min(1, { message: `${childField.Fieldname}  should not be empty` })
          .refine((val) => !isNaN(Number(val)), {
            message: `${childField.Fieldname} should be a number`,
          });

        acc[`${field.Fieldname}.${childField.Fieldname}_3`] = z
          .string()
          .min(1, { message: `${childField.Fieldname} should not be empty` })
          .refine((val) => !isNaN(Number(val)), {
            message: `${childField.Fieldname} should be a number`,
          });
      });
    }

    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object(schemaShape);
};

const dynamicSchema = createDynamicSchema(HT_Yard_Array);
export type DynamicFormType = z.infer<typeof dynamicSchema>;
