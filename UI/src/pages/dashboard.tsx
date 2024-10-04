import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
  GetloginUserApiStore,
  useFieldsStore,
  useHtYardStore,
  useSelectedLocationAndTransactionIDStore,
} from "@/store/store";
import { useEffect, useState } from "react";
import {
  useGetDashboardQuery,
  useGetFieldsBasedOnLocationIdAPIQuery,
} from "@/services/query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTransaByLocationIdAPI } from "@/services/api";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedEmployeeId, setselectedEmployeeId] = useState(0);
  const [selectedLoactionId, setSelectedLocationId] = useState(0);
  const UserDetails = JSON.parse(sessionStorage.getItem("UserDetails"));
  const SelectedL_T_IDStore = useSelectedLocationAndTransactionIDStore(
    (state) => state
  );
  const dailyFields = JSON.parse(sessionStorage.getItem("dailyFields"));
  const { mutate: CreateTransaByLocationId } = useMutation({
    mutationFn: (data: any) => CreateTransaByLocationIdAPI(data),
    onError: (e) => {
      console.log(e, "Error");
    },
    onSuccess: (data: any) => {
      toast.success("Transacted successfully!");
      if (data.status === 200) {
        SelectedL_T_IDStore.setTransactionId(data.data);
      }
    },
  });

  const DashboardData = useHtYardStore((state) => state.HtYard);
  const DashboardMonthlyData = useHtYardStore((state) => state.HtYardMonthly);
  const { data: FieldsData } = useGetFieldsBasedOnLocationIdAPIQuery({
    locationId: selectedLoactionId.locationId,
  });

  const handleCardClick = (LocationDetails: any) => {
    if (LocationDetails.status) {
      alert("OK")
    } else {
      SelectedL_T_IDStore.setLocationId(LocationDetails.id);
      CreateTransaByLocationId({
        locationId: LocationDetails.id,
        employeeId: UserDetails.id,
      });
      navigate("/dynamicformcomp");
      
    }
  };

  return (
    <div className="bg-yellow-100 h-full w-full p-2 flex flex-col overflow-auto">
      <Tabs defaultValue="Daily" className="w-full">
        <div className="h-10 flex justify-start">
          <div className="flex justify-center items-center gap-1">
            <Card className="bg-gray-100 fixed">
              <TabsList className="fixed left-0 top-12 ml-20">
                <TabsTrigger value="Daily">Daily</TabsTrigger>
                <TabsTrigger value="Monthly">Monthly</TabsTrigger>
              </TabsList>
            </Card>
          </div>
        </div>

        <TabsContent value="Daily">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 overflow-auto">
            {DashboardData.map((module, index) => (
              <Card
                key={index}
                className="w-full  bg-yellow-400 cursor-pointer"
                onClick={() => handleCardClick(module)}
              >
                <CardHeader className="flex items-center justify-center text-blue-950">
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
               
                  <p
                    className={`text-center ${
                      module.status ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {module.status ? "Completed" : "Pending"}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Monthly">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 overflow-auto">
            {DashboardMonthlyData.map((module, index) => (
              <Card
                key={index}
                className="w-full bg-yellow-400 cursor-pointer"
                onClick={() => handleCardClick(module)}
              >
                <CardHeader className="flex items-center justify-center text-blue-950">
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
               
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center"></CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
