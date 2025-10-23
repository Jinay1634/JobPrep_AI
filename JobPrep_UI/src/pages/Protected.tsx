import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import {Outlet, useNavigate} from "react-router-dom"
const Protected = () =>{
   const { token, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!loading) {
      if (!token || !user) {
        navigate("/login", { replace: true });
      }
    }
  }, [token, user, loading, navigate]);
  if (loading) return <div>Loading...</div>;
return <Outlet />;

}

export default Protected