import React from 'react'
import { Link } from 'react-router';
import { Home, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    return <header className="bg-base-300 border-b border-base-content/10">
        <div className="mx-auto max-w-6xl px-4 py-4">
            <div className=" flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
                    BearLingo
                </h1>
                <div className=" flex gap-2">
                    <Link to={"/"} className="btn btn-primary">
                        <Home className="size-5" />
                        <span>Home</span>
                    </Link>
                    <Link to={"/login"} className="btn btn-primary">
                        <LogIn className="size-5" />
                        <span>Login</span>
                    </Link>
                    <Link to={"/register"} className="btn btn-primary">
                        <UserPlus className="size-5" />
                        <span>Register</span>
                    </Link>
                </div>
            </div>
        </div>
    </header >
}

export default Navbar;
