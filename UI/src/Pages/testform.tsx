import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrayType, HT_Yard_Array } from "@/lib/ht-yard-array";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createDynamicSchema, DynamicFormType } from "./ZodSchema";

export function DynamicFormComp() {
  const dynamicSchema = createDynamicSchema(HT_Yard_Array);

  const formMethods = useForm<DynamicFormType>({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { handleSubmit, control, formState } = formMethods;
  const { errors } = formState;

  const onSubmit = (data: DynamicFormType) => {
    console.log(data, "form Data");
  };

  const formLoad = (data: ArrayType, parentPath = "") => {
    const currentPath = parentPath
      ? `${parentPath}.${data.Fieldname}`
      : data.Fieldname;

    const renderInput = !data.child || data.child.length === 0;

    return (
      <div className="grid grid-cols-1 gap-2" key={data.Fieldname}>
        {data.child !== undefined && data.child.length > 0 ? (
          <div className="col-span-3 grid grid-cols-1 items-start">
            <div className="grid grid-cols-6 gap-2">
            <label className="w-full h-full flex items-center justify-start">
              {data.Fieldname}
            </label>
            </div>
            <div className="col-span-1 grid grid-cols-1 gap-2">
              {data.child.map((C_Item) => formLoad(C_Item, currentPath))}
            </div>
          </div>
        ) : (
          <div className="col-span-3 grid grid-cols-6 gap-2 items-center">
            <label className="w-full h-full flex items-center justify-start">
              {data.Fieldname}
            </label>
            <div>
              <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
                Last Reading
              </div>
            </div>
            <div className="w-full">
              <FormField
                control={control}
                name={`${currentPath}_1`}
                render={({ field }) => (
                  <FormItem className="max-h-[65px]">
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      className="w-full p-2"
                    />
                    <FormMessage>
                      {errors[`${currentPath}_1`] &&
                        errors[`${currentPath}_1`].message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div className="w-full  max-h-[40px] bg-white  text-black border rounded-[5px] flex items-center justify-center">
                Difference
              </div>
            </div>

            <div>
              <div className="w-full  max-h-[40px] bg-white  text-black border rounded-[5px] flex items-center justify-center">
                Mtd avg
              </div>
            </div>

            <div>
              <div className="w-full  max-h-[40px] bg-white  text-black border rounded-[5px] flex items-center justify-center">
                Last month Avg
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-300 ">
      <div className="text-2xl font-bold text-center bg-gray-500 mb-4 h-12">
        DAILY READINGS
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <Form {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-6 font-semibold ">
                <div>LABEL NAME</div>
                <div>LAST READING</div>
                <div>CURRENT READING</div>
                <div>DIFFERENCE</div>
                <div>MTD AVERAGE</div>
                <div>LAST MONTH AVERAGE</div>
              </div>
              {HT_Yard_Array.map((item) => formLoad(item))}
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  className="flex justify-center items-center w-32 mr-4 bg-gray-500"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
