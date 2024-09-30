import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createZodSchema } from "@/pages/ZodSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useGetFieldsBasedOnLocationIdQuery } from "@/services/query";
import {
  useDynamicFormInsertStore,
  useSelectedLocationIdStore,
} from "@/store/store";
import { useEffect, useState } from "react";
import { DynamicFormInsertAPI } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea"

export function DynamicFormComp() {
  const selectedLoactionId = useSelectedLocationIdStore(
    (state) => state.LocationId
  );
  const { data: FieldsData } = useGetFieldsBasedOnLocationIdQuery({
    LocationId: selectedLoactionId,
  });
  const [dailyFieldsArray, setDailyFieldsArray] = useState([]);
  const [dailyFieldsFlatArray, setDailyFieldsFlatArray] = useState([]);
  const [monthlyFieldsArray, setMonthlyFieldsArray] = useState([]);
  const [MonthlyFieldsFlatArray, setMonthlyFieldsFlatArray] = useState([]);
  const dynamicSchema = createZodSchema(dailyFieldsFlatArray);
  type DynamicFormType = z.infer<typeof dynamicSchema>;
  const dynamicForm = useForm<DynamicFormType>({
    resolver: zodResolver(dynamicSchema),
    mode:"onChange"
  });

  const FiledStroe = useDynamicFormInsertStore();
  const flat: any = ({ childFields = [], ...o }) => [
    o,
    ...childFields.flatMap(flat),
  ];

  useEffect(() => {
    if (FieldsData?.dailyFields?.length > 0) {
      setDailyFieldsArray(FieldsData.dailyFields);
      setDailyFieldsFlatArray(FieldsData.dailyFields.flatMap(flat));
    }
    if (FieldsData?.monthlyFields?.length > 0) {
      setMonthlyFieldsArray(FieldsData.monthlyFields);
    }
  }, [FieldsData]);

  const onSubmit = (data: DynamicFormType) => {
    console.log(data, "form Data");
    let input = {
      fields: FiledStroe.Fields,
      locationId: selectedLoactionId,
      empId: "NPI3838",
      remark: "Test",
      
    };
    DynamicForm(input);
  };

  const { mutate: DynamicForm } = useMutation({
    mutationFn: (data: any) => DynamicFormInsertAPI(data),
    onError: (e) => {
      console.log(e, "Error");
    },
    onSuccess: () => {
      toast.success("Inserted successfully!");
    },
  });

  const onValueChange = async(
    event: any,
    feildId: number,
    subFieldId: number,
    previousReading: number
  ) => {
    const currentReading = parseFloat(event.target.value) || 0;

    const difference = currentReading - previousReading;

    let filed = {
      value: currentReading.toString(),
      fieldId: feildId,
      subFieldId: subFieldId,
      reset: false,
      difference: difference, // Save calculated difference
    };
    let data: any[];

    if (FiledStroe.Fields.length > 0) {
      data = [
        ...(subFieldId === 0
          ? FiledStroe.Fields.filter((item: any) => item.fieldId !== feildId)
          : FiledStroe.Fields.filter(
              (item: any) => item.subFieldId !== subFieldId
            )),
      ];
      data = [...data, filed];
      FiledStroe.setFields(data);
    } else {
      FiledStroe.setFields([filed]);
    }
  };

  const formLoad = (
    fieldData: any,
    parentPath = "",
    ischild = false,
    filedId: number
  ) => {
    const currentPath = parentPath
      ? `${parentPath}.${fieldData.name}`
      : fieldData.name;
    return (
      <div className="grid grid-cols-1 gap-2" key={fieldData.name}>
        {fieldData.childFields && fieldData.childFields.length > 0 ? (
          <div className="col-span-3 grid grid-cols-1 items-start">
            <div className="grid grid-cols-6 gap-2">
              <label className="w-full h-full flex items-center justify-start text-white">
                {fieldData.name}
              </label>
            </div>
            <div className="col-span-1 grid grid-cols-1 gap-2">
              {fieldData.childFields.map((C_Item: any) =>
                formLoad(C_Item, currentPath, true, fieldData.id)
              )}
            </div>
          </div>
        ) : (
          <div className="col-span-3 grid grid-cols-6 gap-2 items-center">
            <label className="w-full h-full flex items-center justify-start text-white">
              {fieldData.name}
            </label>
            <div>
              <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                {fieldData.previousReading !== ""
                  ? fieldData.previousReading
                  : "0"}
              </div>
            </div>
            <div className="w-full">
              <FormField
                control={dynamicForm.control}
                name={fieldData.name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        onBlur={(e) =>
                          onValueChange(
                            e,
                            !ischild ? fieldData.id : filedId,
                            ischild ? fieldData.id : 0,
                            fieldData.previousReading // Pass previous reading here
                          )
                        }
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
               {FiledStroe.Fields.find((item: any) => ischild?item.subFieldId === fieldData.id:item.fieldId === fieldData.id)?.difference || 0}
              </div>
            </div>

            <div>
              <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                {fieldData.mtdAvg}
              </div>
            </div>

            <div>
              <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                {fieldData.previousMonthAvg}
              </div>
            </div>
          </div>
        )}
      </div>
      
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-300">
      <div className="text-2xl font-bold text-center bg-yellow-100 h-12">
        DAILY READINGS
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-indigo-950">
        <Form {...dynamicForm}>
          <form onSubmit={dynamicForm.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2">
              <div className="sticky top-0 z-10 grid grid-cols-6 font-semibold bg-yellow-400 text-black">
                <div className="p-2">LABEL NAME</div>
                <div className="p-2">LAST READING</div>
                <div className="p-2">CURRENT READING</div>
                <div className="p-2">DIFFERENCE</div>
                <div className="p-2">MTD AVERAGE</div>
                <div className="p-2">LAST MONTH AVERAGE</div>
              </div>
              {dailyFieldsArray?.map((item) => formLoad(item))}
              {monthlyFieldsArray?.map((item) => formLoad(item))}
              <Textarea
              className="pr-8 ml-3 mt-3  bg-slate-100 w-full"
              placeholder="Add a comment..."
              >
                
              </Textarea>
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  className="flex justify-center items-center w-32 mr-4 bg-yellow-300 text-black hover:bg-yellow-100"
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
