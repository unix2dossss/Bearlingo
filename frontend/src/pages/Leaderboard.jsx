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
                setLeaderboardData(response.data);
                toast.success("Leaderboard obtained sucessfully!");
                console.log("DATA: ", response);
                console.log("leaderboardData: ", leaderboardData);

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
            <pre>{JSON.stringify(leaderboardData, null, 2)}</pre>

            <input type="checkbox" value="synthwave" className="toggle theme-controller" />

            <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">02</div>
                <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" /></div>
                <div className="list-col-grow">
                    <div>Ellie Beilish</div>
                    <div className="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
                </div>
                <button className="btn btn-square btn-ghost">
                    <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                </button>
            </li>

        </>
    )
}

export default Leaderboard
