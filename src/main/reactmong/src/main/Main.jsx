import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import MainSchedule from "../component/MainSchedule.jsx";


// 메인페이지
function Main() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    

    useEffect(()=> {
        
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다!");
          navigate('/', { replace: true });
        }
        
        setUsername(localStorage.getItem("username"));

    },[])


    const getGreeting = () => {
      const hour = new Date().getHours();
      const name = username;
      if (hour < 11) return `좋은 아침이에요, ${name}님! ✨`;
      if (hour < 17) return `나른한 오후네요 ${name}님, 커피 한 잔 어때요? ☕`;
      if (hour < 22) return `오늘 하루도 고생 많았어요, ${name}님! 🌙`;
      return `${name}님 오늘 하루 수고했어요. 푹 쉬세요! 😴`;
    };

    // 오늘 날짜 가져오기 (예: 2024년 5월 22일 수요일)
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

  return (
    <div className="container" id="container">
            <Header />

            <section style={welcomeSectionStyle}>
                <p style={dateStyle}>{today}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* 포인트 컬러 바 하나만 넣어줘도 분위기가 확 삽니다 */}
                    <div style={{ width: "4px", height: "24px", backgroundColor: "#adb5bd", borderRadius: "2px" }}></div>
                    <h1 style={greetingStyle}>{getGreeting()}</h1>
                </div>
            </section>

            <div>
                <MainSchedule />
            </div>
        </div>
  )
}

export default Main



const welcomeSectionStyle = {
    margin: "30px 40px",
    padding: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #f0f0f0", // 아주 연한 선으로 구분
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)", // 아주 은은한 그림자
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const dateStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#999", // 날짜는 조금 더 차분하게
    letterSpacing: "-0.02em"
};

const greetingStyle = {
    fontSize: "26px",
    fontWeight: "700",
    color: "#222",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

// 인사말 옆에 작은 포인트 바 (선택사항)
const greetingPointStyle = {
    width: "4px",
    height: "24px",
    backgroundColor: "#ff5a5f", // 로고의 오렌지 포인트 컬러와 맞춤
    borderRadius: "2px"
};