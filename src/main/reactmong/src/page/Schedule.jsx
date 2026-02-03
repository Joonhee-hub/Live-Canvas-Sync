import { useNavigate } from "react-router-dom";
import Calcompo from "../component/Calcompo.jsx";
import Header from "../main/Header.jsx";
import { useEffect } from "react";


function Schedule() {
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


      <Calcompo />


    </div>
  )
}

export default Schedule