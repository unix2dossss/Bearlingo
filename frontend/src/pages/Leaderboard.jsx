import { useEffect, useState, useRef } from "react";
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
import { gsap } from "gsap";
import SideNavbar from "../components/SideNavbar.jsx";
import bear from "../assets/BearLeader.svg";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [setLoading] = useState(true);

  const bearRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      bearRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
    );
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await api.get("/users/leaderboard");
        setLeaderboardData(response.data.users);
      } catch (error) {
        console.log("Error in obtaining leaderboard", error);
        toast.error("Error occurred!");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

 useEffect(() => {
  gsap.fromTo(
    bearRef.current,
    { y: 100, opacity: 0 }, // start 100px below and invisible
    { y: 0, opacity: 1, duration: 1.5, ease: "bounce.out" } // move to normal position
  );
}, []);


  return (
    <div className="relative bg-leaderboard-bg bg-cover bg-center min-h-screen">
      <div className="absolute" style={{ left: 'calc(70% - 35%)' }}>
        <img src={title} alt="Leaderboard" className="w-[70%] h-auto" />
      </div>
      <TopNavbar />
      {/* <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src="https://www.onlinegames.io/cat-simulator/embed"
          className="absolute top-0 left-0 w-[100%] h-[100%]"
          frameBorder="0"
          allowFullScreen
          title="An Average Day at the Cat Cafe"
        ></iframe>
      </div> */}  `
      
      {/* <div ref={bearRef} className="w-32 h-32">
        🐻
      </div> */}


      <div className="flex relative">
        <div className="">
          <SideNavbar />
        </div>
      
        <div className="relative flex-1 px-4">
          

          <div className="flex absolute bottom-0 w-full justify-center py-2">
            {/* <ul className="flex flex-col gap-2 w-[1000px] max-h-[600px] overflow-y-auto"> */}           
            <ul className="
              flex flex-col gap-2 
              w-full max-w-[79%] px-4 max-h-[530px] overflow-y-auto
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
            {/* Bear Image */}
            <div ref={bearRef} className="flex-shrink-0 w-[10vw] max-w-[400px] ml-6">
              <img src={bear} alt="Leaderboard Bear" className="w-full h-auto" />
            </div>
          </div>
          
          
        </div>
      </div>

      
    </div >
  );
};

export default Leaderboard;
