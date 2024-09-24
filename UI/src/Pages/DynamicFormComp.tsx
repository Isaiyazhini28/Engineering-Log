// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { createDynamicSchema, DynamicFormType } from "@/pages/ZodSchema";
// import { ArrayType, HT_Yard_Array } from "@/lib/ht-yard-array";
// import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { useSubmitData } from '@/pages/services/mutation'; // Import your hooks
// import { useFetchData } from '@/pages/services/query';

// export function DynamicFormComp() {
//   const dynamicSchema = createDynamicSchema(HT_Yard_Array);

//   const formMethods = useForm<DynamicFormType>({
//     resolver: zodResolver(dynamicSchema),
//     mode: "onChange",
//     reValidateMode: "onChange",
//   });

//   const { handleSubmit, control, formState } = formMethods;
//   const { errors } = formState;

//   const { data, error, isLoading } = useFetchData('/your-fetch-api-endpoint');
//   const mutation = useSubmitData();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   const onSubmit = (data: DynamicFormType) => {
//     mutation.mutate(data);
//   };

//   const formLoad = (data: ArrayType, parentPath = "") => {
//     const currentPath = parentPath
//       ? `${parentPath}.${data.Fieldname}`
//       : data.Fieldname;

//     return (
//       <div className="grid grid-cols-1 gap-2" key={data.Fieldname}>
//         {data.child && data.child.length > 0 ? (
//           <div className="col-span-3 grid grid-cols-1 items-start">
//             <div className="grid grid-cols-6 gap-2">
//               <label className="w-full h-full flex items-center justify-start">
//                 {data.Fieldname}
//               </label>
//             </div>
//             <div className="col-span-1 grid grid-cols-1 gap-2">
//               {data.child.map((C_Item) => formLoad(C_Item, currentPath))}
//             </div>
//           </div>
//         ) : (
//           <div className="col-span-3 grid grid-cols-6 gap-2 items-center">
//             <label className="w-full h-full flex items-center justify-start">
//               {data.Fieldname}
//             </label>
//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Last Reading
//               </div>
//             </div>
//             <div className="w-full">
//               <FormField
//                 control={control}
//                 name={`${currentPath}_1`}
//                 render={({ field }) => (
//                   <FormItem className="max-h-[65px]">
//                     <Input
//                       {...field}
//                       value={field.value ?? ""}
//                       className="w-full p-2"
//                     />
//                     <FormMessage>
//                       {errors[`${currentPath}_1`] && errors[`${currentPath}_1`].message}
//                     </FormMessage>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 difference
//               </div>
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Mtd avg
//               </div>
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Monthly avg
//               </div>
//             </div>
//             </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full w-full bg-slate-300">
//       <div className="text-2xl font-bold text-center bg-gray-500 mb-4 h-12">
//         DAILY READINGS
//       </div>
//       <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
//         <Form {...formMethods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid grid-cols-1 gap-2">
//               <div className="grid grid-cols-6 font-semibold">
//                 <div>LABEL NAME</div>
//                 <div>LAST READING</div>
//                 <div>CURRENT READING</div>
//                 <div>DIFFERENCE</div>
//                 <div>MTD AVERAGE</div>
//                 <div>LAST MONTH AVERAGE</div>
//               </div>
//               {HT_Yard_Array.map((item) => formLoad(item))}
//               <div className="flex justify-end mt-3">
//                 <Button
//                   type="submit"
//                   className="flex justify-center items-center w-32 mr-4 bg-gray-500"
//                   disabled={mutation.isPending}
//                 >
//                   {mutation.isPending ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDynamicSchema, DynamicFormType } from "@/Pages/ZodSchema";
import { ArrayType, HT_Yard_Array } from "@/lib/ht-yard-array";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
      return (
        <div className="grid grid-cols-1 gap-2" key={data.Fieldname}>
          {data.child && data.child.length > 0 ? (
            <div className="col-span-3 grid grid-cols-1 items-start">
              <div className="grid grid-cols-6 gap-2">
                <label className="w-full h-full flex items-center justify-start text-white">
                  {data.Fieldname}
                </label>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-2">
                {data.child.map((C_Item) => formLoad(C_Item, currentPath))}
              </div>
            </div>
          ) : (
            <div className="col-span-3 grid grid-cols-6 gap-2 items-center">
              <label className="w-full h-full flex items-center justify-start text-white">
                {data.Fieldname}
              </label>
              <div>
                <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
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
                        className="w-full p-2 "
                      />
                      <FormMessage>
                        {errors[`${currentPath}_1`] && errors[`${currentPath}_1`].message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
  
              <div>
                <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                  Difference
                </div>
              </div>
  
              <div>
                <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                  MTD Avg
                </div>
              </div>
  
              <div>
                <div className="w-full max-h-[40px] bg-indigo-950 text-white border-indigo-900 border rounded-[5px] p-2">
                  Monthly Avg
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
          <Form {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-2">
                <div className="sticky top-0 z-10 grid grid-cols-6 font-semibold bg-yellow-400 text-black">
                  <div className="p-2">LABEL NAME</div>
                  <div className="p-2">LAST READING</div>
                  <div className="p-2">CURRENT READING</div>
                  <div className="p-2">DIFFERENCE</div>
                  <div className="p-2">MTD AVERAGE</div>
                  <div className="p-2">LAST MONTH AVERAGE</div>
                </div>
                {HT_Yard_Array.map((item) => formLoad(item))}
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    className="flex justify-center items-center w-32 mr-4 bg-yellow-300 text-black">
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
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { createDynamicSchema, DynamicFormType } from "@/pages/ZodSchema";
// import { ArrayType, HT_Yard_Array } from "@/lib/ht-yard-array";
// import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { useNavigate } from "react-router-dom";

// export function DynamicFormComp() {
//   const navigate = useNavigate();
//   const dynamicSchema = createDynamicSchema(HT_Yard_Array);

//   const formMethods = useForm<DynamicFormType>({
//     resolver: zodResolver(dynamicSchema),
//     mode: "onChange",
//     reValidateMode: "onChange",
//   });

//   const { handleSubmit, control, formState } = formMethods;
//   const { errors } = formState;

//   const onSubmit = (data: DynamicFormType) => {
//     console.log(data, "form Data");
//     // Navigate to DynamicGridTable after form submission
//     navigate("/dynamicgridtable");
//   };

//   const formLoad = (data: ArrayType, parentPath = "") => {
//     const currentPath = parentPath
//       ? `${parentPath}.${data.Fieldname}`
//       : data.Fieldname;

//     return (
//       <div className="grid grid-cols-1 gap-2" key={data.Fieldname}>
//         {data.child && data.child.length > 0 ? (
//           <div className="col-span-3 grid grid-cols-1 items-start">
//             <div className="grid grid-cols-6 gap-2">
//               <label className="w-full h-full flex items-center justify-start">
//                 {data.Fieldname}
//               </label>
//             </div>
//             <div className="col-span-1 grid grid-cols-1 gap-2">
//               {data.child.map((C_Item) => formLoad(C_Item, currentPath))}
//             </div>
//           </div>
//         ) : (
//           <div className="col-span-3 grid grid-cols-6 gap-2 items-center">
//             <label className="w-full h-full flex items-center justify-start">
//               {data.Fieldname}
//             </label>
//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Last Reading
//               </div>
//             </div>
//             <div className="w-full">
//               <FormField
//                 control={control}
//                 name={`${currentPath}_1`}
//                 render={({ field }) => (
//                   <FormItem className="max-h-[65px]">
//                     <Input
//                       {...field}
//                       value={field.value ?? ""}
//                       className="w-full p-2"
//                     />
//                     <FormMessage>
//                       {errors[`${currentPath}_1`] && errors[`${currentPath}_1`].message}
//                     </FormMessage>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Difference
//               </div>
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 MTD Avg
//               </div>
//             </div>

//             <div>
//               <div className="w-full max-h-[40px] bg-white text-black border rounded-[5px] p-2">
//                 Monthly Avg
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full w-full bg-slate-300">
//       <div className="text-2xl font-bold text-center bg-gray-500 mb-4 h-12">
//         DAILY READINGS
//       </div>
//       <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
//         <Form {...formMethods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid grid-cols-1 gap-2">
//               <div className="grid grid-cols-6 font-semibold">
//                 <div>LABEL NAME</div>
//                 <div>LAST READING</div>
//                 <div>CURRENT READING</div>
//                 <div>DIFFERENCE</div>
//                 <div>MTD AVERAGE</div>
//                 <div>LAST MONTH AVERAGE</div>
//               </div>
//               {HT_Yard_Array.map((item) => formLoad(item))}
//               <div className="flex justify-end mt-3">
//                 <Button
//                   type="submit"
//                   className="flex justify-center items-center w-32 mr-4 bg-gray-500">
//                   Submit
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
