import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from "../lib/axios";
import TopNavbar from "../components/TopNavbar";
import linkedInIcon from "../assets/linkedin.png";
import starIcon from "../assets/star.png";
import bearIcon from "../assets/Bear.svg";


const Leaderboard = () => {

    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await api.get("/users/leaderboard");
                setLeaderboardData(response.data.users);
                toast.success("Leaderboard obtained sucessfully!");
                console.log("DATA: ", response);

            } catch (error) {
                console.log("Error in obtaining leaderboard", error);
                toast.error("Error occured!");
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboardData();
    }, []);


    return (
        <div className="bg-blue-200 min-h-screen">

            <TopNavbar />

            <br />
            <br />
            <div className="flex justify-center">
                <div className="bg-yellow-300 text-white px-8 py-4 rounded-full shadow-lg w-[300px] border-4 border-white">

                    <h1 className=" text-4xl font-bold text-center flex justify-center font-sans">Leaderboard</h1>
                </div>
            </div>

            <input type="checkbox" value="synthwave" className="toggle theme-controller" />
            <div className="flex justify-center">
                <ul className="list bg-base-100 rounded-box shadow-md justify-center  w-[800px] h-[500px] overflow-y-auto">
                    {leaderboardData.map((user, index) => (
                        <li className="list-row flex items-center p-2 border-b" key={index}>

                            {/* Position on leaderboard */}
                            <div className=" w-[50px] text-4xl font-thin opacity-30 tabular-nums">{index < 3 ? ":)" : index + 1}</div>

                            {/* Profile Image */}
                            <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" /></div>

                            {/* Username */}
                            <div className="w-[50px]">{user.username}</div>

                            {/* LinkedIn icon*/}
                            <button className="btn btn-square btn-ghost">
                                <img height="35" width="35" src={linkedInIcon} alt="LinkedIn Icon"></img>
                            </button>

                            {/* XP */}
                            <div className="flex gap-10">
                                <img height="35" width="35" src={starIcon} alt="Star Icon"></img>
                                <div>{user.xp}</div>
                            </div>
                        </li >

                    ))}
                </ul >
            </div >
        </div>




    )
}

export default Leaderboard
