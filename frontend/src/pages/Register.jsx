import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import OAuth from "../components/OAuth";
import CookieConsent from "../components/CookieConsent";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  // const [linkedIn, _] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // ---- Regex helpers ----
  const nameRegex = /^[A-Za-z\s]{2,30}$/;
  const usernameRegex = /^[\w\s-]{3,20}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; ///^[^\s@]+@gmail\.com$/;
  const linkedInRegex = /^((https?:\/\/)?(www\.)?linkedin\.com\/.*)$/;

  const navigate = useNavigate();

  const validateInputs = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    )
      if (!nameRegex.test(firstName)) {
        toast.error("First Name must be 2–30 letters only.");
        return false;
      }
    if (!nameRegex.test(lastName)) {
      toast.error("Last Name must be 2–30 letters only.");
      return false;
    }

    if (!usernameRegex.test(username)) {
      toast.error("Username must be 3–20 characters (letters, numbers, _, -, space).");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please use a valid email address.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    if (linkedIn.trim() !== "" && !linkedInRegex.test(linkedIn.trim())) {
      toast.error("Please enter a valid LinkedIn URL.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents the values inside the input from changing to default/empty values when register button is pressed
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("All fields that are marked with * must be filled"); // Checks if there are not any input in the fields or an empty value which triggers an error

      return;
    }

    if (!validateInputs()) return; // stop if validation fails

    setLoading(true);

    try {
      await api.post(
        "/users/register",
        {
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
          linkedIn: linkedIn.trim() === "" ? undefined : linkedIn.trim()
        },
        {
          withCredentials: true // Tells the browser to accept cookies from the backend and include them in future requests.
        }
      );
      toast.success("You registered sucessfully!");
      navigate("/login"); // This should navigate to login page
    } catch (error) {
      console.log("Error in registering", error);

      // Handle backend validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // set backend validation errors
      } else {
        toast.error("Failed to register! Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" min-h-screen bg-register-bg bg-cover">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link to={"/"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" />
              Back to Home
            </Link>

            <div className="flex items-center justify-center">
              <div className="card bg-base-100 w-full max-w-4xl mx-auto">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb flex justify-center">Sign Up</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">
                            First Name <span className="label-text text-red-600">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="First Name"
                          className="input input-bordered w-full"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        ></input>
                      </div>
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">
                            Last Name <span className="label-text text-red-600">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="input input-bordered w-full"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        ></input>
                      </div>
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">
                          Username <span className="label-text text-red-600">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Username"
                        className="input input-bordered w-full"
                        value={username}
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setErrors((prev) => ({ ...prev, username: null })); // clear username error
                        }}
                      ></input>
                      {usernameFocus && !usernameRegex.test(username) && (
                        <p className="validator-hint text-sm text-red-600 mt-2">
                          Username must be 3–20 characters (letters, numbers, _, -, space)
                        </p>
                      )}
                      {/* Show an error if username is already taken  */}
                      {errors.username && (
                        <p className="text-sm text-red-600 mt-2">{errors.username[0]}</p>
                      )}
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">LinkedIn URL (Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="LinkedIn"
                        className="input input-bordered"
                        value={linkedIn}
                        onChange={(e) => setLinkedIn(e.target.value)}
                      ></input>
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">
                          Email <span className="label-text text-red-600">*</span>
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: null })); // clear email error
                        }}
                      ></input>
                      {emailFocus && !emailRegex.test(email) && (
                        <p className="validator-hint text-sm text-red-600 mt-2">
                          Please use a valid email address
                        </p>
                      )}
                      {/* Show an error if email is already taken  */}
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email[0]}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Password <span className="label-text text-red-600">*</span>
                          </span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="input validator input-bordered w-full"
                          minLength="8"
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                          onFocus={() => setFocused(true)} // show hint on focus
                          onBlur={() => setFocused(false)} // hide hint on blur
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {focused && !passwordPattern.test(password) && (
                          // <p className="validator-hint text-sm text-gray-500 mt-1">
                          //   Must be at least 8 characters long.
                          //   <br />
                          //   Should include a number, a lowercase and
                          //   <br /> an uppercase letter.
                          // </p>
                          <ul className="text-sm mt-2 space-y-1 bg-base-100 p-3 rounded-md shadow-sm">
                            <li
                              className={password.length >= 8 ? "text-green-600" : "text-red-600"}
                            >
                              {password.length >= 8 ? "✔" : "✖"} At least 8 characters
                            </li>
                            <li
                              className={/[0-9]/.test(password) ? "text-green-600" : "text-red-600"}
                            >
                              {/[0-9]/.test(password) ? "✔" : "✖"} At least one number
                            </li>
                            <li
                              className={/[a-z]/.test(password) ? "text-green-600" : "text-red-600"}
                            >
                              {/[a-z]/.test(password) ? "✔" : "✖"} At least one lowercase letter
                            </li>
                            <li
                              className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-600"}
                            >
                              {/[A-Z]/.test(password) ? "✔" : "✖"} At least one uppercase letter
                            </li>
                          </ul>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Confirm Password <span className="label-text text-red-600">*</span>
                          </span>
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          className="input validator input-bordered"
                          minLength="8"
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                          onFocus={() => setFocused2(true)}
                          onBlur={() => setFocused2(false)}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {/* {focused2 && !passwordPattern.test(confirmPassword) && (
                          <p className="validator-hint text-sm text-red-600 mt-1">
                            Must be more than 8 characters, including:
                            <br />
                            At least one number. At least one lowercase letter. At least one
                            uppercase letter
                          </p>
                        )} */}
                        {focused2 && confirmPassword && confirmPassword !== password && (
                          <p className="validator-hint text-sm text-red-600 mt-2">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="card-actions justify-center mt-6 mb-8">
                      <button
                        type="submit"
                        className="btn btn-primary w-full md:w-80 h-18"
                        disable={loading.toString()}
                      >
                        {loading ? "Registering ..." : "Register"}
                      </button>
                    </div>

                    <div className="divider text-gray-500 text-sm w-full md:w-80 mx-auto">Or</div>

                    {/* Google Login */}
                    <OAuth />
                    <p className="text-center text-sm mt-6">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary">
                        Login here
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CookieConsent />
      </div>
    </>
  );
};

export default Register;
