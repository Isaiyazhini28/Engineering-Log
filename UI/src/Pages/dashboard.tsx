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
  useFieldsStore,
  useHtYardStore,
  useSelectedLocationIdStore,
} from "@/store/store";
import { useEffect, useState } from "react";
import { useGetFieldsBasedOnLocationIdQuery } from "@/services/query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Dashboard() {
  const navigate = useNavigate();

  const [selectedLoactionId, setSelectedLocationId] = useState(0);
  const setLocationId = useSelectedLocationIdStore(
    (state) => state.setLocationId
  );

  const DashboardData = useHtYardStore((state) => state.HtYard);
  const DashboardMonthlyData = useHtYardStore((state) => state.HtYardMonthly);

  const handleCardClick = (LocationDetails: any) => {
    setLocationId(LocationDetails.id);
    navigate("/dynamicformcomp");
  };

  return (
    <div className="bg-yellow-100 h-full w-full p-2 flex flex-col overflow-auto">
      
      <Tabs defaultValue="Daily" className="w-full">
        <div className="h-10 flex justify-start">
          <div className="flex justify-center items-center gap-1">
            <TabsList>
              <TabsTrigger value="Daily">Daily</TabsTrigger>
              <TabsTrigger value="Monthly">Monthly</TabsTrigger>
            </TabsList>
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
                  {/* Card content removed as 'previous' and 'current' are no longer needed */}
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  {/* <p className="text-center">Completed</p> */}
                  <p className={`text-center ${
                module.status === "Completed"
                  ? "text-green-500"
                  : module.status === "Pending"
                  ? "text-red-500"
                  : ""
              }`}>
                {module.status}
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
                  {/* Card content removed as 'previous' and 'current' are no longer needed */}
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  {/* <p className="text-center">Completed</p> */}
                  <p className={`text-center ${
                module.status === "Completed"
                  ? "text-green-500"
                  : module.status === "Pending"
                  ? "text-red-500"
                  : ""
              }`}>
                {module.status}
              </p>
                </CardFooter>
              </Card>
            ))}
          </div>


        </TabsContent>
      </Tabs>
    </div>

   
  );
}

export default Dashboard;
