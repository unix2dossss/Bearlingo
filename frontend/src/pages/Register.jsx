import React from 'react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault() // prevents the values inside the input from changing to default values when register button is pressed
        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error("All red fields that are  marked with * required to be filled"); // Checks if there are not any input in the fields or an empty value which triggers an error 
        }

    }


    return (
        <>
            <div className=" min-h-screen bg-base-300">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-2xl, mx-auto">
                        <Link to={"/"} className="btn btn-ghost mb-6">
                            <ArrowLeftIcon className="size-5" />
                            Back to Home
                        </Link>

                        <div className="card bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb flex justify-center">
                                    Register
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex gap-4">
                                        <div className="form-control mb-4 w-full">
                                            <label className="label">
                                                <span className="label-text">First Name</span>
                                            </label>
                                            <input type="text"
                                                placeholder="First Name"
                                                className="input input-bordered"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}></input>
                                        </div>
                                        <div className="form-control mb-4  w-full">
                                            <label className="label">
                                                <span className="label-text">Last Name</span>
                                            </label>
                                            <input type="text"
                                                placeholder="Last Name"
                                                className="input input-bordered"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}></input>
                                        </div>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Username</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Username"
                                            className="input input-bordered"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}></input>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">LinkedIn (Optional)</span>
                                        </label>
                                        <input type="text"
                                            placeholder="LinkedIn"
                                            className="input input-bordered"
                                            value={linkedIn}
                                            onChange={(e) => setLinkedIn(e.target.value)}></input>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Email"
                                            className="input input-bordered"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}></input>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Password"
                                            className="input input-bordered"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}></input>
                                    </div>
                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Confirm Password</span>
                                        </label>
                                        <input type="text"
                                            placeholder="Confirm Password"
                                            className="input input-bordered"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}></input>
                                    </div>
                                    <div className="card-actions justify-center mb-2 h-20">
                                        <button type="submit" className="btn btn-primary w-40 h-18" diasble={loading}>
                                            {loading ? "Registering ..." : "Register"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>
                </div>

            </div >

        </>
    )
}

export default Register
