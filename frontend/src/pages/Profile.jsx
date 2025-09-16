import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../components/TopNavbar';
import api from "../lib/axios";
import { useUserStore } from "../store/user";
import toast from 'react-hot-toast'

const Profile = () => {
    const [level1, setLevel1] = useState("");
    const [level2, setLevel2] = useState("")
    const [level3, setLevel3] = useState("");
    const [allInfo, setallInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState("");
    const navigate = useNavigate();

    const user = useUserStore.getState().user;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                await useUserStore.getState().fetchUser();
            }

            const currentUser = useUserStore.getState().user;
            if (!currentUser) {
                navigate("/login"); // redirect if still not logged in
            } else {
                setUserInfo(currentUser);
                console.log(currentUser);
            }
        };
        fetchUserData();
    }, [navigate]);


    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const userProgress = await api.get("/progress/levels");
                console.log(userProgress);

            } catch (error) {
                console.log("Error in obtaining user progress levels", error);
                toast.error("Error occurred!");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProgress();
    }, []);



    return (
        <>
            <Navbar />
            <div className="bg-blue-200 min-h-screen  border border-blue-600">

                <h1 className="text-xl flex justify-center text-black p-2">Hi {user.username}</h1>

                <div className="flex justify-center border border-red-600 gap-10 mt-16">
                    {/* For TSX uncomment the commented types below */}
                    <div className="card bg-base-100 w-[340px] h-[500px] shadow-sm">
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes" />
                        </figure>
                        <div className="card-body flex items-center border border-green-900">
                            <div
                                className="radial-progress bg-primary text-primary-content border-primary border-4"
                                style={{ "--value": 70 } /* as React.CSSProperties */} aria-valuenow={70} role="progressbar">
                                70%
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-[340px] h-[500px] shadow-sm">
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes" />
                        </figure>
                        <div className="card-body flex items-center border border-green-900">
                            <div
                                className="radial-progress bg-primary text-primary-content border-primary border-4"
                                style={{ "--value": 70 } /* as React.CSSProperties */} aria-valuenow={70} role="progressbar">
                                70%
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-[340px] h-[500px] shadow-sm">
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes" />
                        </figure>
                        <div className="card-body flex items-center border border-green-900">
                            <div
                                className="radial-progress bg-primary text-primary-content border-primary border-4"
                                style={{ "--value": 70 } /* as React.CSSProperties */} aria-valuenow={70} role="progressbar">
                                70%
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
};

export default Profile;
