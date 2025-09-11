import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from "../lib/axios";
import TopNavbar from "../components/TopNavbar";
import linkedInIcon from "../assets/linkedin.png";
import starIcon from "../assets/star.png";
import bearIcon from "../assets/Bear.svg";
import goldMedal from "../assets/gold.png"
import silverMedal from "../assets/silver.png";
import bronzeMedal from "../assets/bronze.png";
import title from '../assets/leaderboard-title-doodle.svg';
import Logo from '../assets/Logo1.svg';


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
            {/* <div className="flex pr-2 mt-2 justify-end">
                <input type="checkbox" value="synthwave" className="toggle theme-controller" />
            </div> */}
            <div className="flex justify-center" >
                {/* <div className="bg-yellow-300 text-white px-8 py-4 rounded-full shadow-lg w-[300px] border-4 border-white">
                    <h1 className=" text-4xl font-bold text-center flex justify-center font-sans">Leaderboard</h1>
                </div> */}
                <img
                    src={title}
                    alt="Leaderboard"
                    className="w-2/5 h-auto"
                />
            </div>
            <br />


            <div className="flex justify-center">
                <ul className="list bg-base-100 rounded-box shadow-md justify-center  w-[800px] h-[600px] overflow-y-auto">
                    {leaderboardData.map((user, index) => (
                        <li className="list-row flex items-center p-2 border-b h-[100px]" key={index}>

                            {/* Position on leaderboard */}
                            {index === 0 && (
                                < div className="w-[100px] text-4xl font-thin opacity-100 tabular-nums ml-3"><img height="35" width="35" src={goldMedal} alt="Gold medal"></img></div>
                            )}

                            {index === 1 && (
                                < div className="w-[100px] text-4xl font-thin opacity-100 tabular-nums ml-3"><img height="35" width="35" src={silverMedal} alt="Silver medal"></img></div>
                            )}

                            {index === 2 && (
                                < div className="w-[100px] text-4xl font-thin opacity-100 tabular-nums ml-3"><img height="35" width="35" src={bronzeMedal} alt="Bronze medal"></img></div>
                            )}

                            {![0, 1, 2].includes(index) && (
                                < div className="w-[100px] text-4xl font-thin opacity-30 tabular-nums ml-3">{index + 1}</div>
                            )}

                            {/* Profile Image */}
                            <div className="w-[100px]"><img className=" size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" /></div>

                            {/* Username */}
                            < div className="w-[250px] flex justify-center" > {user.username}</div>

                            {/* LinkedIn icon*/}
                            <div className=" w-[190px]">
                                <button className=" btn btn-square btn-ghost">
                                    <img height="35" width="35" src={linkedInIcon} alt="LinkedIn Icon"></img>
                                </button>
                            </div>

                            {/* XP */}
                            < div className=" flex gap-2 justify-center align-center" >
                                <img height="35" width="35" src={starIcon} alt="Star Icon"></img>
                                <div className="flex justify-center align-center">{user.xp}</div>
                            </div>

                        </li >

                    ))
                    }
                </ul >
            </div >
        </div >




    )
}

export default Leaderboard
