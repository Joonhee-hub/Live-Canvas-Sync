import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/RoomList.css';
import '../css/room.css';
import { useNavigate } from 'react-router-dom';

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const myId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [manageModalOpen, setManageModalOpen] = useState(false); 
    const [selectedRoom, setSelectedRoom] = useState(null); 
    const [refreshToggle, setRefreshToggle] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        // 1. 방 목록 로드 (REST API만 사용)
        axios.get("http://localhost/room/list", {
            headers: { Authorization: token }
        })
        .then(res => {
            console.log("받아온 방 리스트:", res.data);
            setRooms(res.data);
        })
        .catch(err => console.error("방 목록 로드 실패! :", err));

        // 🚀 소켓 로직은 쿨하게 삭제 완료! 
    }, [token, refreshToggle]);

    const handleJoin = (roomId, roomTitle) => {
        if (!window.confirm(`${roomTitle} 방으로 입장 하시겠습니까?`)) return;
        navigate(`/chat/${roomId}`, {
             state: { title: roomTitle }
        });
    };

    const openManageModal = (room) => {
        setSelectedRoom(room);
        setManageModalOpen(true);
    };

    const handleUserDelete = (targetUser) => {
        const targetId = targetUser.userId;
        const currentStatus = targetUser.userStatus; 
        const msg = currentStatus === '신청' 
                    ? `${targetId}님의 신청을 거절하시겠습니까?` 
                    : `${targetId}님을 정말 추방하시겠습니까?`;

        if (!window.confirm(msg)) return;

        axios.delete(`http://localhost/room/${selectedRoom.roomId}/${targetId}`, {
            headers: { Authorization: token }
        })
        .then(res => {
            if (res.data === "yes") {
                alert("성공적으로 처리되었습니다.");
                setManageModalOpen(false); 
                setRefreshToggle(prev => !prev); 
            } else {
                alert("처리에 실패했습니다.");
            }
        })
        .catch(err => {
            console.error("삭제 요청 에러:", err);
            alert("처리 중 오류가 발생했습니다.");
        });
    };

    const handleUserStatusChange = (targetId, newStatus) => {
        const msg = newStatus === '일반' ? `${targetId}님의 신청을 승인하시겠습니까?` : `상태를 ${newStatus}(으)로 변경하시겠습니까?`;
        if (!window.confirm(msg)) return;

        axios.patch(`http://localhost/room/status`, {
            roomId: selectedRoom.roomId,
            userId: targetId,
            userStatus: newStatus
        }, {
            headers: { Authorization: token }
        })
        .then(res => {
            if (res.data === "yes") {
                alert("승인 처리가 완료되었습니다! 🚀");
                setManageModalOpen(false); 
                setRefreshToggle(prev => !prev); 
            } else {
                alert("승인에 실패했습니다!");
            }
        })
        .catch(err => {
            console.error("상태 변경 실패 :", err);
            alert("오류가 발생했습니다.");
        });
    };

    const handleExitRoom = (roomId) => {
        if (!window.confirm("이 방에서 나가시겠습니까?")) return;

        axios.delete(`http://localhost/room/exit/${roomId}/${myId}`, {
            headers: { "Authorization": token } 
        })
        .then((res) => {
            if(res.data === "yes") {
                alert("퇴장하셨습니다.");
                setRefreshToggle(prev => !prev);
            } else {
                alert("퇴장에 문제가 발생했습니다.");
            }
        })
        .catch((err) => {
            console.error("퇴장 에러 :", err);
            alert("오류 발생!");
        });
    };

    const handleDestroyRoom = (roomId) => {
        if (!window.confirm("회의를 종료하면 방이 삭제됩니다. 정말 종료하시겠습니까?")) return;
        
        axios.delete(`http://localhost/room/destroy/${roomId}`, {
            headers: { "Authorization": token } 
        })
            .then((res) => {
                if(res.data === "yes"){
                    alert("회의가 종료되었습니다.");
                    setRefreshToggle(prev => !prev);
                    setManageModalOpen(false); 
                } else {
                    alert("종료 처리에 실패했습니다.");
                }
            })
            .catch((err) => {
                console.error("삭제 실패 :", err);
                alert("서버 오류가 발생했습니다.");
            });
    };

    return (
        <div className="room-list-container">
            <div className="yellow-box-area">
                {rooms.length > 0 ? (
                    rooms
                    .filter(room => {
                        const myInfo = room.roomUserVOList?.find(user => user.userId === myId);
                        return myInfo?.userStatus !== '대기';
                    })
                    .map((room) => (
                        <div key={room.roomId} className="room-item-row">
                            <div className="room-info-left">
                                <span className="room-name-text">{room.roomTitle}</span>
                            </div>

                            <div className="room-btns-right">
                                <button onClick={() => handleJoin(room.roomId, room.roomTitle)} className="btn-join">참가</button>
                                {room.roomUserVOList?.some(user => user.userId === myId && user.userStatus === '방장') ? (
                                    <button className="owner-option-btn" onClick={() => openManageModal(room)}>⚙️</button>
                                ) : (
                                    <button className="btn-exit" onClick={()=>handleExitRoom(room.roomId)}>나가기</button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">참여 중인 회의방이 없습니다.</p>
                )}
            </div>

            {manageModalOpen && selectedRoom && (
                <div className="custom-alert-overlay">
                    <div className="custom-alert-box">
                        <div className="alert-header">[{selectedRoom.roomTitle}] 방 관리</div>
                        <div className="alert-body">
                        {/* 🗝️ 방 입장 영역 */}
                        <div className="modal-code-section">
                            <div className="code-info">
                                <strong>🗝️ 방 입장 코드 :</strong> 
                                <span className="code-value">{selectedRoom.roomInviteCode}</span>
                            </div>
                            <button className="btn-destroy" onClick={() => handleDestroyRoom(selectedRoom.roomId)}>
                                회의종료
                            </button>
                        </div>
                        
                        <div className="member-manage-area">
                            <div className="manage-section">
                                <h4 className="manage-title">👥 참여 멤버</h4>
                                <ul className="manage-list">
                                    {selectedRoom.roomUserVOList
                                        ?.filter(user => user.userStatus === '방장' || user.userStatus === '일반')
                                        .map(user => (
                                            <li key={user.userId} className="manage-item">
                                                <span className="user-id-text">
                                                    {user.userId} <span className="user-role">({user.userStatus})</span>
                                                </span>
                                                {user.userId !== myId && (
                                                    <button className="btn-mini-delete" onClick={() => handleUserDelete(user)}>✕</button>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <hr className="manage-hr" />

                            <div className="manage-section">
                                <h4 className="manage-title">📩 참여희망자 목록</h4>
                                <ul className="manage-list">
                                    {selectedRoom.roomUserVOList
                                        ?.filter(user => user.userStatus === '대기')
                                        .map(user => (
                                            <li key={user.userId} className="manage-item">
                                                <span className="user-id-text">{user.userId}</span>
                                                <div className="apply-btns">
                                                    <button className="btn-mini-approve" onClick={() => handleUserStatusChange(user.userId, '일반')}>승인</button>
                                                    <button className="btn-mini-reject" onClick={() => handleUserDelete(user)}>거절</button>
                                                </div>
                                            </li>
                                        ))}
                                    {selectedRoom.roomUserVOList?.filter(user => user.userStatus === '대기').length === 0 && (
                                        <p className="no-applicants">신청자가 없습니다.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                        <hr />
                        <div className="alert-footer">
                            <button className="alert-btn cancel" onClick={() => setManageModalOpen(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}