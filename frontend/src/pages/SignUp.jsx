import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../store/slices/userSlice";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "bidder",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const handleInputChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, avatar: file });
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setAvatarPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    await dispatch(register(formData));
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center border-2 py-2 px-3 rounded-t-md">
              <FaUser className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                className="pl-2 w-full outline-none border-none"
                placeholder="Full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3">
              <MdEmail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                className="pl-2 w-full outline-none border-none"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3">
              <RiLockPasswordFill className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                className="pl-2 w-full outline-none border-none"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3">
              <FaUserTie className="h-5 w-5 text-gray-400" />
              <select
                name="role"
                className="pl-2 w-full outline-none border-none bg-transparent"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="bidder">Bidder</option>
                <option value="auctioneer">Auctioneer</option>
              </select>
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-b-md">
              <IoMdImages className="h-5 w-5 text-gray-400" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleInputChange}
                className="pl-2 w-full outline-none border-none"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
