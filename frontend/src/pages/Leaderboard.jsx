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
        <ul className="
  flex flex-col gap-2 
  w-full max-w-[1000px] px-4 max-h-[530px] overflow-y-auto
  border-4 border-solid border-white py-2 rounded-md
  bg-[#c3ddfd] 
  bg-[url('data:image/svg+xml,%3Csvg%20width=%2724%27%20height=%2740%27%20viewBox=%270%200%2024%2040%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d=%27M0%2040c5.523%200%2010-4.477%2010-10V0C4.477%200%200%204.477%200%2010v30zm22%200c-5.523%200-10-4.477-10-10V0c5.523%200%2010%204.477%2010%2010v30z%27%20fill=%27%23ffffff%27%20fill-opacity=%270.4%27%20fill-rule=%27evenodd%27/%3E%3C/svg%3E')] 
  bg-repeat 
  bg-[length:24px_40px]
">

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
    </div >
  );
};

export default Leaderboard;
