import React from 'react';
import Navbar from '../components/TopNavbar';

const Profile = () => {
    return (
        <>
            <Navbar />
            <div className="bg-blue-200 min-h-screen  border border-blue-600">

                <div className="flex justify-center border border-red-600 gap-10 mt-16">

                    {/* For TSX uncomment the commented types below */}
                    <div className="card bg-base-100 w-96 shadow-sm">
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
                    <div className="card bg-base-100 w-96 shadow-sm">
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
                    <div className="card bg-base-100 w-96 shadow-sm">
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
