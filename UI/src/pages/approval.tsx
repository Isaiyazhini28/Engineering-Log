import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Module_Array, ArrayType } from "@/lib/module-array"; // Import Module_Array

function Approval() {
  // Dummy approval count array
  const approvalCounts = [
    { id: 1, approval: "Approval 1" },
    { id: 2, approval: "Approval 2" },
    { id: 3, approval: "Approval 3" },
    { id: 4, approval: "Approval 4" },
    { id: 5, approval: "Approval 5" },
    { id: 6, approval: "Approval 6" },
    { id: 7, approval: "Approval 7" },
    { id: 8, approval: "Approval 8" },
    { id: 9, approval: "Approval 9" },
    { id: 10, approval: "Approval 10" },
    { id: 11, approval: "Approval 11" },
    { id: 12, approval: "Approval 12" },
    { id: 13, approval: "Approval 13" },
    { id: 14, approval: "Approval 14" },
    { id: 15, approval: "Approval 15" },
    { id: 16, approval: "Approval 16" },
    { id: 17, approval: "Approval 17" },
  ];

  const navigate = useNavigate();


  
  const handleCardClick = (title: string) => {
    if (title === "WB MIXER RH(2)") {
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
        {Module_Array.map((module, index) => {
          const approvalData = approvalCounts.find(
            (item) => item.id === module.sequenceId
          );
          return (
            <Card
              key={index}
              className="w-full bg-yellow-400 cursor-pointer"
              onClick={() => handleCardClick(module.name)}
            >
              <CardHeader className="flex items-center justify-center text-blue-950">
                <CardTitle>{module.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
              
                <p className="text-center">
                  {approvalData ? approvalData.approval : "No Approval"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Approval;
