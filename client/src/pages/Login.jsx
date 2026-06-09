import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userBaseUrl } from "../axios.js";

const Login = () => {
  const navigate = useNavigate();

  const userAuth = localStorage.getItem("userAuth");
  const authUser = userAuth ? JSON.parse(userAuth) : null;

  useEffect(() => {
    if (authUser?.isLogin) navigate("/");
  }, [authUser, navigate]);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleInputFieldChange = (e) => {
    // const data = e.target;
    // console.log(data)
    const { name, value } = e.target;
    // console.log("name: ",name, "| value: ", value)
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };
  //   console.log(loginForm)
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const result = await userBaseUrl.post("/login", loginForm);
      if (result.status === 200) {
        const authData = {
          isLogin: true,
          token: result?.data?.tokenID,
        };
        localStorage.setItem("userAuth", JSON.stringify(authData));
        setLoginForm({
          email: "",
          password: "",
        });
        navigate("/");
        toast.success(result?.data?.message);
      }
      //   console.log(result);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-90">
      <div className="card shadow-lg border-0" style={{ width: "420px" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-success fw-bold">🔐 Login</h3>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                name="email"
                value={loginForm.email}
                onChange={handleInputFieldChange}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                name="password"
                value={loginForm.password}
                onChange={handleInputFieldChange}
              />
            </div>

            {/* Button */}
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none text-success">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
