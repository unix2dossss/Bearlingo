import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import TopNavbar from "../components/TopNavbar";
import linkedInIcon from "../assets/linkedin.png";
import starIcon from "../assets/star.png";
import goldMedal from "../assets/gold.png";
import silverMedal from "../assets/silver.png";
import bronzeMedal from "../assets/bronze.png";
import title from "../assets/leaderboard-title-doodle.svg";
import LeaderboardCard from "../components/LeaderboardCard.jsx";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await api.get("/users/leaderboard");
        setLeaderboardData(response.data.users);
        toast.success("Leaderboard obtained successfully!");
      } catch (error) {
        console.log("Error in obtaining leaderboard", error);
        toast.error("Error occurred!");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

  return (
    <div className="bg-blue-200 min-h-screen">
      <TopNavbar />

      <div className="flex justify-center">
        <img src={title} alt="Leaderboard" className="w-2/5 h-auto" />
      </div>

      <div className="flex justify-center py-14">
        {/* <ul className="flex flex-col gap-2 w-[1000px] max-h-[600px] overflow-y-auto"> */}
        <ul className="flex flex-col gap-2 w-full max-w-[1000px] px-4">
          {leaderboardData.map((user, index) => (
            <LeaderboardCard
              key={index}
              user={user}
              index={index}
              goldMedal={goldMedal}
              silverMedal={silverMedal}
              bronzeMedal={bronzeMedal}
              linkedInIcon={linkedInIcon}
              starIcon={starIcon}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
