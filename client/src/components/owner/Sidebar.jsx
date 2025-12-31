import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext(); 
  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    try {
      if (!image) return;

      const formData = new FormData();
      formData.append('image', image); 

      const { data } = await axios.post('/api/owner/update-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        await fetchUser(); 
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error updating image");
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm bg-white">
      <div className="group relative">
        <label htmlFor="image" className="cursor-pointer">
          <img 
            src={image ? URL.createObjectURL(image) : user?.image || assets.profile_img || "https://images.unsplash.com/photo-1511367461989-f85a21fda167"}
            alt="profile"
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover border border-borderColor"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/20 rounded-full group-hover:flex items-center justify-center pointer-events-none">
            <img src={assets.edit_icon} alt="edit" className="w-4 md:w-6" />
          </div>
        </label>
      </div>

      {image && (
        <button onClick={updateImage} className="mt-2 flex items-center justify-center py-1 px-3 gap-1 bg-primary text-white text-[10px] rounded-full cursor-pointer hover:bg-blue-700">
          Save <img src={assets.tick_icon} width={10} alt="check" className="invert brightness-0" />
        </button>
      )}

      <p className="mt-2 text-base font-medium max-md:hidden text-gray-800">{user?.name || "Admin"}</p>

      <div className="w-full mt-6">
        {ownerMenuLinks.map((link, index) => (
          <NavLink key={index} to={link.path} className={({ isActive }) => `relative flex items-center gap-3 w-full py-4 pl-6 transition-all ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
            <img src={location.pathname === link.path ? link.coloredIcon : link.icon} alt={link.name} className="w-5 h-5" />
            <span className="max-md:hidden">{link.name}</span>
            {location.pathname === link.path && <div className="absolute right-0 w-1 h-8 bg-primary rounded-l-md" />}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;