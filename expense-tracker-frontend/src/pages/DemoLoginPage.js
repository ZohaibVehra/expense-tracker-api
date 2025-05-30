import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DemoLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        const response = await axios.post("http://localhost:8080/auth/login", {
          username: "Demo_Username",
          password: "Demo_Password",
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (error) {
        console.error("Demo login failed:", error);
      }
    };

    loginAsDemo();
  }, [navigate]);

  return (
    <div className="text-white p-6">
      Logging in as demo...
    </div>
  );
}

export default DemoLoginPage;
