import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useFieldsStore, useHtYardStore, useSelectedLocationIdStore } from "@/store/store";
import { useEffect, useState } from "react";
import { useGetFieldsBasedOnLocationIdQuery } from "@/services/query";

function Dashboard() {
  const navigate = useNavigate();

  const [selectedLoactionId,setSelectedLocationId]=useState(0)
  const setLocationId=useSelectedLocationIdStore((state)=>state.setLocationId)



  const DashboardData=useHtYardStore((state)=>state.HtYard)



  const handleCardClick = (LocationDetails: any) => {
    setLocationId(LocationDetails.id)
      navigate("/dynamicformcomp");
  };

  return (
    <div className="bg-yellow-100 h-full w-full p-2 flex flex-col">
      <div className="h-10 flex justify-start">
        <div className="flex justify-center items-center gap-1">
          <label className="text-xs font-bold">Daily</label>
          <Switch />
          <label className="text-xs font-bold">Monthly</label>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 overflow-auto">
        {DashboardData.map((module, index) => (
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
              <p className="text-center">Completed</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
