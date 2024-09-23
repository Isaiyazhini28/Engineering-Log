import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const cardsData = [
    { title: "HT Yard ", previous: "Previous 1", current: "Current 1" },
    { title: "Water Meter", previous: "Previous 2", current: "Current 2" },
    { title: "DG", previous: "Previous 3", current: "Current 3" },
    { title: "MV Panel", previous: "Previous 4", current: "Current 4" },
    { title: "WB Mixer RH(2)", previous: "Previous 5", current: "Current 5" },
    { title: "WB RH", previous: "Previous 6", current: "Current 6" },
    { title: "UPS", previous: "Previous 7", current: "Current 7" },
    { title: "Compressor", previous: "Previous 8", current: "Current 8" },
    { title: "WB SB KWH", previous: "Previous 9", current: "Current 9" },
    { title: "SB RH", previous: "Previous 10", current: "Current 10" },
    { title: "Watermeter-2", previous: "Previous 10", current: "Current 10" },
    { title: "DM Water", previous: "Previous 10", current: "Current 10" },
  ];

  const navigate = useNavigate();

  const handleCardClick = (title: string) => {
    if (title === "WB Mixer RH(2)") {
      navigate("/dynamicformcomp");
    }
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
                  <p className="text-center">{card.previous}</p>
                  <p className="text-center">{card.current}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  <p className="text-center">Completed</p>
                </CardFooter>
              </Card>
            ))}
      </div>
      {/* 
        <div className="flex justify-center items-center h-screen">
          <div className="h-[80vh] w-full overflow-y-scroll flex flex-wrap justify-center gap-4">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                className="w-80 bg-yellow-400 cursor-pointer"
                onClick={() => handleCardClick(card.title)}
              >
                <CardHeader className="flex items-center justify-center text-blue-950">
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-center">{card.previous}</p>
                  <p className="text-center">{card.current}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  <p className="text-center">Completed</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div> */}
    </div>
  );
}

export default Dashboard;
