import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Module_Array, ArrayType } from "@/lib/module-array"; // Import Module_Array
import { useApprovalStore } from "@/store/store";

function Approval() {
  const Approval = useApprovalStore((state) => state.Approval);
  const pendingCount = useApprovalStore((state) => state.Approval);
  const navigate = useNavigate();

  const handleCardClick = (title: string) => {
     {
      navigate("/approvaltable");
    }
  };

  return (
    <div className="bg-yellow-100 h-full w-full p-2 flex flex-col">
      <div className="h-10 flex justify-start">
        <div className="flex justify-center items-center gap-1">
          <label className="text-xs font-bold">Approval count</label>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 overflow-auto">
        {Approval.map((module, index) => {
          return (
            <Card
              key={index}
              className="w-full bg-yellow-400 cursor-pointer"
              onClick={() => handleCardClick(module.locationName)}
            >
              <CardHeader className="flex items-center justify-center text-blue-950">
                <CardTitle>{module.locationName}</CardTitle>
                <div>{module.pendingCount}</div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {/* Display the corresponding approval count */}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Approval;
