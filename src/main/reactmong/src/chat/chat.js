import React, { useEffect, useState, useRef } from 'react';
import DrawingBoard from '../board/DrawingBoard';
import '../css/chat.css';
import { useLocation, useParams } from 'react-router-dom';

function Chat() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [rcvMsg, setRcvMsg] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const location = useLocation();
  const roomTitle = location.state?.title || "회의";
  
  const myId = localStorage.getItem("userId");
  const userName = localStorage.getItem("username");
  const { roomId } = useParams();
  const token = localStorage.getItem("token");
  const webSocket = useRef(null);
  const scrollRef = useRef(null);

  // 그림 데이터 저장하기이
  const drawingRef = useRef(null);


  const drawingsave = async() => {
      if(drawingRef.current) {
        const fileBlob = await drawingRef.current.getImageData();
        
        // 사용자에게 파일 이름 입력받기
        let fileName = prompt("저장할 파일 이름을 입력하세요:", "my_drawing");

      
        if (fileName === null) return;

        // 없을 경우 기본값을 drawing으루 
        if (fileName.trim() === "") {
          fileName = "drawing";
        }

        // 자식에서 받아온 Blob 데이터를 임시 URL로 변환
        const url = window.URL.createObjectURL(fileBlob);
        
        // 가상의 'a' 태그 생성
        const link = document.createElement("a");
        link.href = url;
        
        // 사용자가 입력한 이름에 확장자(.png)를 붙여서 설정
        link.download = `${fileName}.png`; 
        
        // 만든 가짜 링크를 DOM에 잠시 추가
        document.body.appendChild(link);

        link.click();  // 클릭해서 다운로드 시작
        document.body.removeChild(link); // DOM에서 제거
        
        // 임시 URL 삭제메모리 정리
        window.URL.revokeObjectURL(url);
        

      }
  }

  const connectSocket = () => {

    // 주소 끝에 ?userId= 를 붙여 서버 중복 방지
    const socketUrl = `ws://localhost/ws/chat/${roomId}?token=${token}`;
    webSocket.current = new WebSocket(socketUrl);

    webSocket.current.onopen = () => {
      console.log("WebSocket 연결 성공! 🚀");
      setSocketConnected(true);

      const enterData = {
        type: "ENTER",
        name: "SYSTEM",
        msg: `${userName}님이 입장하셨습니다! 🔥`
      };
      webSocket.current.send(JSON.stringify(enterData));
    };

    webSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'COUNT') {
        setUserCount(data.count);
        return;
      }
      //  그림판 관련 메시지는 DrawingBoard 안에서 처리하도록 건너뜀
      if (data.type === 'DRAWING' || data.type === 'START' || data.type === 'CLEAR') return;

      const displayMsg = data.type === "ENTER" ? `📢 ${data.msg}` : `${data.name}: ${data.msg}`;
      setRcvMsg((prev) => [...prev, displayMsg]);
    };

    webSocket.current.onclose = () => {
      setSocketConnected(false);
      console.log("연결 종료");
    };
  };

  useEffect(() => {
    if (webSocket.current && (webSocket.current.readyState === WebSocket.OPEN || webSocket.current.readyState === WebSocket.CONNECTING)) {
      return;
    }
    connectSocket();

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
        webSocket.current = null; 
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [rcvMsg]);

  const sendMessage = () => {
    if (sendMsg && socketConnected) {
      const talkData = {
        type: "TALK",
        name: userName, 
        msg: sendMsg
      };
      webSocket.current.send(JSON.stringify(talkData));
      setSendMsg("");
    }
  };

  return (
    <div className="chat-page-container">
      <h1 className="room-title">{roomTitle}회의방</h1>
      <div className="main-layout">
        <div className="content-section chat-left">
          <div className="section-header">
            <h2 className="user-name">{userName}님</h2>
            <button className="btn exit-btn" onClick={() => window.location.href='/room'}>나가기</button>
          </div>
          <div className="status-indicator">
            {socketConnected ? "🟢 연결됨" : "🔴 끊김"}
            <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>
              👥 현재 회의 중인 인원: {userCount}명
            </span>
          </div>
          <div className="chat-history">
            {rcvMsg.map((msg, i) => <div key={i} className="chat-message">{msg}</div>)}
            <div ref={scrollRef}></div> 
          </div>
          <div className="input-group">
            <input 
              className="chat-input"
              value={sendMsg} 
              onChange={(e) => setSendMsg(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && sendMessage()} 
              placeholder="메시지 입력..." 
            />
            <button onClick={sendMessage} className="btn send-btn">전송</button>
          </div>
        </div>
        <div className="content-section drawing-right">
          <div className="board-container">
            {/* 💡 [핵심 패치] DrawingBoard에 우리 대장 소켓을 넘겨준다! */}
            <DrawingBoard sharedWebSocket={webSocket.current} ref={drawingRef} />
          </div>
          <button className="btn save-btn" onClick={drawingsave}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;