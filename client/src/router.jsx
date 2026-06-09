import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import { Home, About, Contact, Login, Register } from "./pages";
import { ProtectedRoute } from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* 🌍 Public Routes */}

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* 🔐 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Route>,
  ),
);

export default router;
