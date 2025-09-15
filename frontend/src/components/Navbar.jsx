import React from 'react';
import { Link } from 'react-router';
import { Home, LogIn, UserPlus } from 'lucide-react';
import Logo from '../assets/Logo1.svg'; // adjust path if needed

const Navbar = () => {
  return (
    <header className="bg-white border-b border-base-content/10">
      <div className="mx-auto max-w-7xl flex items-center justify-between p-4">

        {/* Logo on the left */}
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-13 w-auto" />
        </Link>

        {/* Buttons on the right */}
        <div className=" flex gap-2">
          <Link to={"/login"} className="btn btn-primary btn-outline">
            <LogIn className="size-5" />
            <span>Login</span>
          </Link>
          <Link to={"/register"} className="btn btn-primary">
            <UserPlus className="size-5" />
            <span>Sign up</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
