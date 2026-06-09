import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import { RouterProvider } from "react-router-dom";

import router from "./router";
import "./App.css";
const App = () => {
  return (
    <>
      {/* react-toastify */}
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* react-hot-toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
