import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

import "./user/styles/global.css";

import Admin from "./admin/pages/admin.jsx";
import Auth from "./user/pages/auth/auth.jsx";

import Nav from "./user/components/Nav";
import LoadingOverlay from "./user/components/LoadingOverlay";
import HomeScreen from "./user/pages/HomeScreen";
import LibraryScreen from "./user/pages/LibraryScreen";
import WorkspaceScreen from "./user/pages/WorkspaceScreen";
import AIScreen from "./user/pages/AIScreen";
import AdminScreen from "./user/pages/AdminScreen";
import ProfileScreen from "./user/pages/ProfileScreen";
import SlidePreviewPage from "./user/pages/SlidePreviewPage";

const DEFAULT_USER = {
  firstName: "Quang Thảo",
  lastName: "Trương Như",
  email: "thaotruong@gmail.com",
  phone: "0901 234 567",
  birthYear: "2004",
  gender: "male",
  school: "THPT Nguyễn Huệ",
  grade: "12",
  bio: "",
};

function AppContent() {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [user, setUser] = useState(DEFAULT_USER);

  // Dữ liệu truyền từ LibraryScreen/WorkspaceScreen → AIScreen
  const [projectData, setProjectData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const showLoadingThen = useCallback((path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 3500);
  }, [navigate]);

  const hideNavRoutes = ["/login", "/admin"];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div id="suky-root">
      {showNav && <Nav user={user} />}

      <LoadingOverlay visible={loading} message={loadingMsg} />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route
          path="/library"
          element={
            <LibraryScreen
              setLoading={setLoading}
              setLoadingMsg={setLoadingMsg}
              setProjectData={setProjectData}
            />
          }
        />
        <Route
          path="/workspace"
          element={
            <WorkspaceScreen
              setLoading={setLoading}
              setLoadingMsg={setLoadingMsg}
              setProjectData={setProjectData}
            />
          }
        />
        <Route
          path="/ai"
          element={<AIScreen projectData={projectData} />}
        />
        <Route
          path="/profile"
          element={<ProfileScreen user={user} setUser={setUser} />}
        />

        <Route path="/login" element={<Auth />} />
        <Route path="/preview-slides" element={<SlidePreviewPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
