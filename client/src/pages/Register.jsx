import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userBaseUrl } from "../axios.js";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const userAuth = localStorage.getItem("userAuth");
  const authUser = userAuth ? JSON.parse(userAuth) : null;

  useEffect(() => {
    if (authUser?.isLogin) navigate("/");
  }, [authUser, navigate]);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };
  //   console.log(registerForm)

  const handleRegisterForm = async (e) => {
    try {
      e.preventDefault();
      const result = await userBaseUrl.post("/register", registerForm);
      if (result.status === 201) {
        setRegisterForm({
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
        toast.success(result?.data?.message);
      }
    //   console.log(result);
    } catch (error) {
    //   console.log(error);
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-90">
      <div className="card shadow-lg border-0" style={{ width: "450px" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-success fw-bold">📝 Register</h3>

          <form onSubmit={handleRegisterForm}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                name="username"
                value={registerForm.username}
                onChange={handleInputFieldChange}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={registerForm.email}
                onChange={handleInputFieldChange}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Create password"
                name="password"
                value={registerForm.password}
                onChange={handleInputFieldChange}
              />
            </div>

            {/* Button */}
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/" className="text-decoration-none text-success">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
