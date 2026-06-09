import axios from "axios";

export const contactBaseUrl = axios.create({
  baseURL: "http://localhost:8000/api/contacts",
});

export const userBaseUrl = axios.create({
  baseURL: "http://localhost:8000/api/users",
});

// on every request token verified
const authInterceptor = (config) => {
  try {
    const authToken = localStorage.getItem("userAuth");
    const user = authToken ? JSON.parse(authToken) : null;

    if (user?.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.log("Auth parse error", error);
  }

  return config;
};

contactBaseUrl.interceptors.request.use(authInterceptor);
contactBaseUrl.interceptors.response.use((response) => response, (error)=>{
  if(error.response && error.response.status === 401){
    localStorage.removeItem('userAuth');
    window.location.href = '/login'
  }
});
userBaseUrl.interceptors.request.use(authInterceptor);