import BoardList from "../component/BoardList.jsx";
import Header from "../main/Header.jsx";
import '../css/board.css'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Board() {
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
        <BoardList />
    </div>
  )
}

export default Board