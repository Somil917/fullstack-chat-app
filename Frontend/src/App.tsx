import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/login-form";
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useUserStore();

  // console.log(authUser)

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !authUser && !isCheckingAuth ? (
              <div className="w-full h-screen flex justify-center items-center">
                <LoginForm view={"sign-in"} />
              </div>
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? (
              <div className="w-full h-screen flex justify-center items-center">
                <LoginForm view={"sign-up"} />
              </div>
            ) : (
              <Home />
            )
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
