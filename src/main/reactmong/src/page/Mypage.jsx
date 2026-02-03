import { useNavigate } from "react-router-dom";
import User from "../component/User.jsx";
import Header from "../main/Header.jsx";
import { useEffect } from "react";


function Mypage() {
        const navigate = useNavigate();


      useEffect(()=> {
          
          const token = localStorage.getItem("token");
          if (!token) {
            alert("로그인이 필요합니다!");
            navigate('/', { replace: true });
          }
      },[])

  return (
    <div className="container" id="container">
      <Header />
      <User />
    </div>
  )
}

export default Mypage