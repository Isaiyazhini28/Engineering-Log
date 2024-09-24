import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { useNavigate } from "react-router-dom";
  
  function Approval() {
    const cardsData = [
      { title: "HT Yard ", approval: "Approval 1" },
      { title: "Water Meter", approval: "Approval 2" },
      { title: "DG", approval: "Approval 3" },
      { title: "MV Panel", approval: "Approval 4" },
      { title: "WB Mixer RH(2)", approval: "Approval 5" },
      { title: "WB RH", approval: "Approval 6" },
      { title: "UPS", approval: "Approval 7" },
      { title: "Compressor", approval: "Approval 8" },
      { title: "WB SB KWH", approval: "Approval 9" },
      { title: "SB RH", approval: "Approval 10" },
      { title: "Watermeter-2", approval: "Approval 11" },
      { title: "DM Water", approval: "Approval 12" },
    ];
  
    const navigate = useNavigate();
  
    //   function handleCardClick(title: string): void {
    //       throw new Error("Function not implemented.");
    //   }

    const handleCardClick = (title: string) => {
      if (title === "WB Mixer RH(2)") {
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
          {cardsData.map((card, index) => (
            <Card
              key={index}
              className="w-full bg-yellow-400 cursor-pointer"
              onClick={() => handleCardClick(card.title)}
            >
              <CardHeader className="flex items-center justify-center text-blue-950">
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <p className="text-center">{card.approval}</p>
              </CardContent>
              {/* <CardFooter className="flex flex-col items-center justify-center">
                <p className="text-center">Completed</p>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  export default Approval;
  