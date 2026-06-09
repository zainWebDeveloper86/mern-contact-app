//    ++++++++++++++++++++++      if used useSearchParams     ++++++++++++++++++++++++

// import React, { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";

// const Navbar = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const searchTerm = searchParams.get("search") || "";

//   const [inputValue, setInputValue] = useState(searchTerm);

//   // ✅ Sync input with URL when it changes (back/forward button)
//   // useEffect(() => {
//   //   setInputValue(searchTerm);
//   // }, [searchTerm]);

//   const handleSearch = (value) => {
//     setInputValue(value);

//     // // ✅ Debouncing with 500ms delay
//     // const timer = setTimeout(() => {
//     //   if (value.trim()) {
//     //     setSearchParams({ search: value });
//     //   } else {
//     //     setSearchParams({});
//     //   }
//     // }, 200);

//     // return () => clearTimeout(timer);
//     // ✅ Debouncing with 500ms delay

//     if (value.trim()) {
//       setSearchParams({ search: encodeURIComponent(value) });
//     } else {
//       setSearchParams({});
//     }
//   };

//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "About", path: "/about" },
//     { label: "Contact", path: "/contact" },
//   ];

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light">
//       <div className="container px-0">
//         <div className="row d-flex justify-content-between w-100 align-items-center mx-auto">
//           <div className="col-md-2">
//             <Link to="/" className="navbar-brand text-uppercase">
//               <strong>Contact</strong> App
//             </Link>
//           </div>

//           <ul className="col-md-6 d-flex gap-4 justify-content-center align-items-center m-0">
//             {navItems.map(({ label, path }) => (
//               <li key={path} style={{ listStyle: "none" }}>
//                 <NavLink
//                   to={path}
//                   className={({ isActive }) =>
//                     `text-decoration-none navbar-link ${
//                       isActive ? "text-danger" : "text-black"
//                     }`
//                   }
//                 >
//                   {label}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           <div className="col-md-3">
//             <div className="position-relative w-100">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="🔍 Search contacts..."
//                 value={inputValue}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 style={{ paddingRight: "35px" }}
//               />
//               {inputValue && (
//                 <i
//                   className="fa-solid fa-xmark position-absolute top-50 translate-middle-y"
//                   onClick={() => handleSearch("")}
//                   style={{
//                     right: "12px",
//                     cursor: "pointer",
//                     color: "#6c757d",
//                     fontSize: "18px",
//                     transition: "color 0.2s",
//                   }}
//                   onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
//                   onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
//                 ></i>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

//    ++++++++++++++++++++++      without useSearchParams     ++++++++++++++++++++++++

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userBaseUrl } from "../axios.js";

const Navbar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const navigage = useNavigate();

  const userAuth = localStorage.getItem("userAuth");
  const authUser = userAuth ? JSON.parse(userAuth) : null;

  const handleSearch = (value) => {
    setInputValue(value);

    //    ++++++++++++++    if we used setSearchParams    +++++++++++++

    // if (value.trim()) {
    //   setSearchParams({ search: encodeURIComponent(value) });
    // } else {
    //   setSearchParams({});
    // }
    onSearch(value);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("userAuth");
    const result = await userBaseUrl.post("/logout");
    if (result?.status === 200) {
      navigage("/login");
      toast.success(result?.data?.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container px-1">
        <div className="row d-flex justify-content-between w-100 align-items-center mx-auto">
          <div className="col-md-2">
            <Link to="/" className="navbar-brand text-uppercase m-0">
              <strong>Contact</strong> App
            </Link>
          </div>

          {authUser?.isLogin ? (
            <>
              <ul className="col-md-6 d-flex gap-4 justify-content-center align-items-center m-0">
                {navItems.map(({ label, path }) => (
                  <li key={path} style={{ listStyle: "none" }}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `navbar-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="col-md-4 d-flex align-items-center gap-3">
                <div className="position-relative w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search contacts..."
                    value={inputValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ paddingRight: "35px" }}
                  />
                  {inputValue && (
                    <i
                      className="fa-solid fa-xmark position-absolute top-50 translate-middle-y"
                      onClick={() => handleSearch("")}
                      style={{
                        right: "12px",
                        cursor: "pointer",
                        color: "#6c757d",
                        fontSize: "18px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
                      onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                    ></i>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-dark"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
