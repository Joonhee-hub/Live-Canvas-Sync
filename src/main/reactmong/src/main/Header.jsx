import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    

    useEffect(()=> {
          setUsername(localStorage.getItem("username"));
          
  
    },[])

  // 공통 스타일 정의
  const navItemStyle = {
    textDecoration: 'none',
    color: '#888', // 기존보다 조금 더 연한 회색
    fontSize: '14px',
    fontWeight: '500',
    marginLeft: '20px',
    transition: 'color 0.2s' // 마우스 올렸을 때 부드럽게 변하도록
  };

  // 로그아웃 버튼
  const logout = () => {
      localStorage.removeItem("token");

      navigate('/', { replace:true})
      alert("로그아웃 되셨습니다 !");
  }



  return (
   <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 40px',
      backgroundColor: '#fcfcfc', // 순백색보다 살짝 차분한 회색빛 화이트
      borderBottom: '1px solid #e5e5e5', // 선명한 회색 선
      fontFamily: 'sans-serif'
    }}>
      {/* 로고 */}
      <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.5px', color: '#444' }}>
        <a href="/main" style={{ textDecoration: 'none', color: 'inherit' }}>Main</a>
      </div>

      {/* 메뉴와 버튼 컨테이너 */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <nav style={{ marginRight: '40px' }}>
          <a href="/mypage" style={{ ...navItemStyle, fontWeight:'bold', color:'#333', marginRight:'15px'}}>
            <span style={{ filter: 'grayscale(1)', opacity: 0.7, marginRight: '5px'}}>👤</span> {username}님
          </a>   
          <a href="/room" style={navItemStyle}>회의 Page</a>
          <a href="/board" style={navItemStyle}>공지사항</a>
          <a href="/schedule" style={navItemStyle}>나의 일정</a>
        </nav>

        {/* 로그아웃 버튼 (연한 회색 톤) */}
        <button style={{
          backgroundColor: '#555', // 진한 회색으로 변경
          color: '#fff',           // 배경이 어두우니 글자는 흰색으로
          border: 'none',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          marginLeft:'13px',
          transition: 'background-color 0.2s'
        }} onClick={logout}>
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;