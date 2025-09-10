import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from "../lib/axios";
import TopNavbar from "../components/TopNavbar";


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
        <>

            <TopNavbar />
            <br />
            <br />

            <input type="checkbox" value="synthwave" className="toggle theme-controller" />
            <div className="flex justify-center">
                <ul className="list bg-base-100 rounded-box shadow-md justify-center w-[800px]">
                    {leaderboardData.map((user, index) => (
                        <li className="list-row flex items-center justify-between gap-4 p-2 border-b" key={index}>
                            <div className="flex gap-3">
                                <div className="text-4xl font-thin opacity-30 tabular-nums">{index < 3 ? index + 1 : ""}</div>
                                <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" /></div>
                            </div>
                            <div className="list-col-grow">
                                <div>{user.username}</div>
                            </div>
                            <button className="btn btn-square btn-ghost">
                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                            </button>
                        </li>

                    ))}
                </ul>
            </div>



        </>
    )
}

export default Leaderboard
