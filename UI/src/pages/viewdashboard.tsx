import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApprovalStore, useHtYardStore, useTableFilterStore } from "@/store/store";
import { useNavigate } from "react-router-dom";

function ViewDashboard() {
  const DashboardData = useHtYardStore((state) => state.HtYard);
  const DashboardMonthlyData = useHtYardStore((state) => state.HtYardMonthly);
  const Approval = useApprovalStore((state) => state.Approval);
  const navigate = useNavigate();
  const TableFilter=useTableFilterStore((state)=>state)

  
  const handleCardClick = (data:any) => {
    TableFilter.setlocationId(data.locationId)
    
      navigate("/viewgrid");
  
  };


  return (
    <div className="bg-yellow-100 h-full w-full p-2 flex flex-col">
      <div className="h-10 flex justify-start">
        <div className="flex justify-center items-center gap-1">
          <label className="text-xs font-bold">View</label>
        </div>
      </div>

     
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-blue-950"></h2>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 overflow-auto">
          {Approval.map((module, index) => (
            <Card
              key={index}
              className="w-full bg-yellow-400 cursor-pointer"
              onClick={() => handleCardClick(module)}
            >
              <CardHeader className="flex items-center justify-center text-blue-950">
                <CardTitle>{module.locationName}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {/* Additional content for DashboardData */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      
    </div>
  );
}

export default ViewDashboard;
