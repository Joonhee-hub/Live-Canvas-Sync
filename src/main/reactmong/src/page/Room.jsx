import RoomList from "../component/RoomList.jsx";
import Header from "../main/Header.jsx";
import '../css/room.css'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Room() {
     const navigate = useNavigate();
     const token = localStorage.getItem("token");

    useEffect(()=> {
        
    
        if (!token) {
          alert("로그인이 필요합니다!");
          navigate('/', { replace: true });
        }
    },[])

  // 회의 참가 모달
  const [joinModalOpen, setJoinModalOpen] = useState(false); 
  // 회의 만들기
  const [createModalOpen,setCreateModalOpen] = useState(false);

  // 이건 회의방 추가 될 때 List 업로드임!
  const [refreshToggle, setRefreshToggle] = useState(false);

  // 회의방 신청중인 List
  const [joinList, setJoinList] = useState([]);


  const [roomtitle, setRoomtitle] = useState("");
  const [roompeople, setRoompeople] = useState(6);
  const [roomCode, setRoomCode] = useState("");




  // 회의 만들기 모달 open/close 
  const modalOpen = () => {
    setCreateModalOpen(pre => !pre);
  }

  // 회의 참가 모달 open/close 
  const modaljoinOpen = () => {
    setJoinModalOpen(pre => !pre);
  }

  // 회의 참가 Modal을 눌렀을 때만 실행 !
  useEffect(()=> {
    
    axios.get("http://localhost/room/joinlist",{
      headers:{
        Authorization: token 
      }
    })
    .then(res => {
      console.log("신청 목록 : ",res.data);
      setJoinList(res.data);
    })
    .catch(err => console.error(err))
  },[joinModalOpen])

  // 회의 만들기 btn 클릭시
  const createroom = () => {
 
      const roomData = {
        "roomTitle" : roomtitle,
        "roomAttendees" : roompeople
      }

      // 요청 
      axios.post("http://localhost/room/create", roomData, {
          headers: { 
            Authorization: token 
          }
      })
      .then(res => {

        console.log(res.data);
        if(res.data === "yes") {
          alert("회의방 생성 성공");
          setCreateModalOpen(false);
          // 2. 성공 시 토글 값을 반전시켜 컴포넌트 재마운트 유도
          setRefreshToggle(prev => !prev);
        } else {
          alert("회의방 생성 실패");
          setCreateModalOpen(false);
        }

      })
      .catch(err => console.error(err))
  }

  // 회의방 참가 btn 클릭시
  const joinroom = () => {
      // 토큰
      const token = localStorage.getItem("token");

        if(joinList.some(item => item.roomInviteCode === roomCode)) {
          alert("이미 신청하셨습니다!");
          setRoomCode("");
          return false;       
        }

        const joinData = {
          "roomInviteCode" : roomCode
        }
        console.log(joinData);
        console.log(token);
        // 요청 
        axios.post("http://localhost/room/join", joinData, {
            headers: { 
              Authorization: token 
            }
        })
        .then(res => {
            console.log(res.data);
            if(res.data === "yes") {
              alert("신청이 완료됐습니다!");
              setRoomCode("");
              setJoinModalOpen(false);
              // 2. 성공 시 토글 값을 반전시켜 컴포넌트 재마운트 유도
              setRefreshToggle(prev => !prev)
            } else {
              alert("참가 실패 !");
              setJoinModalOpen(false);
            }
         })
        .catch(err => console.error(err))
  }

  return (
    <div className="container" id="container">
      <Header />
      <div className="room-page-content"> 
        <div className="header-section">
          <button className="join-room-btn" onClick={modaljoinOpen}>참가 하기</button>
          <button className="create-room-btn" onClick={modalOpen}>회의 만들기</button>
        </div>
        
        <RoomList key={refreshToggle} />
      </div>

      {/* 회의 만들기 Modal 시작 */}
      {createModalOpen && (
          <div className="custom-alert-overlay">
            <div className="custom-alert-box">
              <div className="alert-header">회의방 만들기</div>
              
              <div className="alert-body">
                <div className="input-group">
                  <label htmlFor="roomTitle">회의방 제목</label>
                  <input type="text" id="roomTitle" className="alert-input" value={roomtitle} onChange={(e) => setRoomtitle(e.target.value)}/>
                </div>

                <div className="input-group">
                  <label htmlFor="maxPeople">최대 인원수 설정</label>
                  <select id="maxPeople" className="alert-select" value={roompeople} onChange={(e) => setRoompeople(e.target.value)}>
                    <option value="6">2 ~ 6명</option>
                    <option value="11">7 ~ 11명</option>
                    <option value="16">12 ~ 16명</option>            
                  </select>
                </div>
              </div>

              <div className="alert-footer">
                <button className="alert-btn cancel" onClick={() => setCreateModalOpen(false)}>취소</button>
                <button className="alert-btn confirm" onClick={createroom} >생성하기</button>
              </div>
            </div>
          </div>
      )}
      {/* 회의 만들기 Modal 끝 */}


      {/* 회의 참가 Modal 시작 */}
      {joinModalOpen && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box">
            <div className="alert-header">회의 참가</div>
            
            <div className="alert-body">
              {/* 신청 중인 회의방 섹션 */}
              <div className="input-group">
                <label>현재 신청중인 회의방</label>
                <div className="room-table-container">
                  <table className="room-list-table">
                    <thead>
                      <tr>
                        <th>회의방 제목</th>
                        <th>코드</th>
                      </tr>
                    </thead>
                     <tbody>
                      {joinList.length > 0 ? (
                        joinList.map((room) => (
                          <tr key={room.roomId} className="clickable-row">
                            <td>{room.roomTitle}</td>
                            <td className="code-cell">{room.roomInviteCode}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data">신청 중인 회의방이 없습니다.</td>
                        </tr>
                      )}
                    </tbody> 
                  </table>
                </div>                 
              </div>
              <hr className="section-divider" />
              {/* 코드 입력 섹션 */}
              <div className="input-group">
                <label htmlFor="roomTitle">회의방 신청</label>
                <input 
                  type="text" 
                  id="roomTitle" 
                  className="alert-input" 
                  placeholder="참가 코드를 입력하세요"
                  value={roomCode} 
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
            </div>

            <div className="alert-footer">
              <button className="alert-btn cancel" onClick={() =>setJoinModalOpen(false)}>취소</button>
              <button className="alert-btn confirm" onClick={joinroom}>입장</button>
            </div>
          </div>
        </div>
      )}
      {/* 회의 참가 Modal 끝 */}


    </div>
  );
}

export default Room;