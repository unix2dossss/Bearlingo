import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../components/TopNavbar';
import api from "../lib/axios";
import { useUserStore } from "../store/user";

const Profile = () => {
    const [level1, setLevel1] = useState("");
    const [level2, setLevel2] = useState("")
    const [level3, setLevel3] = useState("");
    const [allInfo, setallInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (!user) {
            navigate("/login"); // redirect if not logged in
        }
    }, [user, navigate]);


    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                console.log("FROM TRY BLOCK", currentUser);

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
