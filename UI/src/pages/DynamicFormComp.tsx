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

import {
  useDynamicFormInsertStore,
  useSelectedLocationAndTransactionIDStore,
} from "@/store/store";
import { useEffect, useState } from "react";
import { UpdateFieldvalueAPI } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { number, z } from "zod";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { useGetFieldsBasedOnLocationIdAPIQuery } from "@/services/query";
import { createHierarchicalArray } from "@/lib/utils";

export function DynamicFormComp() {
  const queryClient = useQueryClient();
  const selectedLoactionId = useSelectedLocationAndTransactionIDStore(
    (state) => state
  );
  const { data: FieldsData } = useGetFieldsBasedOnLocationIdAPIQuery({
    locationId: selectedLoactionId.LocationId,
  });

  const [dailyFieldsArray, setDailyFieldsArray] = useState([]);
  const [monthlyFieldsArray, setMonthlyFieldsArray] = useState([]);
  const [dailyFieldsHierarchicalArray, setDailyFieldsHierarchicalArray] = useState<any>([]);
  const dynamicSchema = createZodSchema(dailyFieldsArray);
  type DynamicFormType = z.infer<typeof dynamicSchema>;
  const dynamicForm = useForm<DynamicFormType>({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
  });
  const UserDetails = JSON.parse(sessionStorage.getItem("UserDetails"));
  const FiledStroe = useDynamicFormInsertStore();
  const flat: any = ({ childFields = [], ...o }) => [
    o,
    ...childFields.flatMap(flat),
  ];

  useEffect(() => {
    if (FieldsData?.dailyFields?.length > 0) {
      setDailyFieldsArray(FieldsData.dailyFields);
      let HierarchicalArray = createHierarchicalArray(FieldsData.dailyFields)
      setDailyFieldsHierarchicalArray(HierarchicalArray)
      // setDailyFieldsFlatArray(FieldsData.dailyFields.flatMap(flat));
    }
    if (FieldsData?.monthlyFields?.length > 0) {
      setMonthlyFieldsArray(FieldsData.monthlyFields);
    }
  }, [FieldsData]);

  useEffect(() => {
    if (dailyFieldsArray.length > 0) {
      dailyFieldsArray.map((field: any) => {
        dynamicForm.setValue(field.subFieldId !== null ? field.subFieldName + "/" + field.fieldName : field.fieldName, field.value)
      })
    }
  }, [dailyFieldsArray]);

  const onSubmit = (data: DynamicFormType) => {
    console.log(data, "form Data");

    // let input = {
    //   fields: FiledStroe.Fields,
    //   locationId: selectedLoactionId,
    //   empId: "NPI3838",
    //   remark: "Test",

    // };
    // DynamicForm(input);
  };

  const { mutate: UpdateFieldvalue } = useMutation({
    mutationFn: (data: any) => UpdateFieldvalueAPI(data),
    onError: (e) => {
      console.log(e, "Error");
    },
    onSuccess: (Res) => {
      toast.success(Res.data);
      queryClient.refetchQueries({ queryKey: ["FieldsBasedOnLocationId"] });
    },
  });

  const onValueChange = async (
    event: any,
    transactionValueId: number,
    previousReading: string
  ) => {
    if (event.target.value !== "") {
      const currentReading = parseFloat(event.target.value) || 0;

      const difference = currentReading - +previousReading;

      let input = {
        value: currentReading.toString(),
        transactionValueId: transactionValueId,
        reset: false,
        employeeId: UserDetails.id,
        difference: difference,
      };
      UpdateFieldvalue(input);
    }
  };

  const formLoad = (
    fieldData: any,
    parentPath = "",
    ischild = false,
    filedId: number
  ) => {
    const currentPath = parentPath
      ? `${parentPath}.${fieldData.fieldName}`
      : fieldData.fieldName;
    return (
      <div className="grid grid-cols-1 gap-2" key={fieldData.fieldName}>
        {fieldData?.childFields?.length > 0 ? (
          <div className="col-span-3 grid grid-cols-1 items-start">
            <div className="grid grid-cols-6 gap-2">
              <label className="w-full h-full flex items-center justify-start text-white">
                {fieldData.fieldName}
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
              {fieldData.subFieldId !== null ?  fieldData.subFieldName:fieldData.fieldName}
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
                name={
                  fieldData.subFieldId !== null
                    ? fieldData.subFieldName + "/" + fieldData.fieldName
                    : fieldData.fieldName
                }
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        onBlur={(e) =>
                          onValueChange(
                            e,
                            fieldData.transactionValueId,
                            fieldData.previousReading
                          )
                        }
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                {fieldData.difference || 0}
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
              {dailyFieldsHierarchicalArray?.map((item) => formLoad(item))}
              {monthlyFieldsArray?.map((item) => formLoad(item))}
              <Textarea
                className="pr-8 ml-3 mt-3  bg-slate-100 w-full"
                placeholder="Add a comment..."
              ></Textarea>
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
function useGetFieldsBasedOnLocationIdAPIQueryI(arg0: { LocationId: number }): {
  data: any;
} {
  throw new Error("Function not implemented.");
}
