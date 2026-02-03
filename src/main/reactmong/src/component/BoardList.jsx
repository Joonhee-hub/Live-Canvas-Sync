import axios from "axios";
import { useEffect, useState } from "react"
import '../css/board.css'

function BoardList() {
    // 회의방 & 공지사항 List
    const [roomlist, setRoomlist] = useState([]);
    const [boardlist, setBoardlist] = useState([]);

    // 모달 & 선택 상태
    const [selectedRoom, setSelectroom] = useState("");
    const [boardModalOpen, setBoardModalOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [createModal, setCreateMoal] = useState(false);

    // 입력 Form State
    const [boardtitle, setBoardtitle] = useState("");
    const [boardcontent, setBoardcontent] = useState("");
    const [boardfile, setBoardfile] = useState(null);
    const currentLoginUser = localStorage.getItem("userId");

    // 페이지네이션 State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 한 페이지당 5개 고정

    const totalPages = Math.ceil(boardlist.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = boardlist.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost/board/roomlist", {
            headers: { Authorization: token }
        })
        .then(res => {
            setRoomlist(res.data);
            setCurrentPage(1);
        })
    }, [])

    const boardChange = (e) => {
        const token = localStorage.getItem("token");
        const selectId = e.target.value;
        setSelectroom(selectId);
        axios.get("http://localhost/board/roomboard", {
            params: { roomId: selectId },
            headers: { Authorization: token }
        })
        .then(res => {
            setBoardlist(res.data);
            setCurrentPage(1); 
        })
        .catch(err => { console.error(err) })
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const boardcreate = () => { setCreateMoal(pre => !pre); }

    const createboard = () => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("roomId", selectedRoom);
        formData.append("noticeTitle", boardtitle);
        formData.append("noticeContent", boardcontent);
        if (boardfile != null) { formData.append("noticeFile", boardfile); }

        axios.post('http://localhost/board/createboard', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token
            }
        })
        .then(res => {
            if (res.data === "yes") {
                alert("공지사항 등록 성공 !");
                setCreateMoal(false);
                // 등록 후 목록 갱신 로직 추가하면 더 Perfect 함
            } else {
                alert("공지사항 등록 실패");
            }
        })
        .catch(err => { console.error(err) })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) { setBoardfile(selectedFile); }
    };

    const openDetailModal = (item) => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost/board/detail", {
            params: { noticeId: item.noticeId },
            headers: { Authorization: token }
        })
        .then(res => {
            setSelectedBoard(res.data);
            setBoardModalOpen(true);
        })
        .catch(err => { alert("데이터를 가져오는 데 실패했습니다."); });
    };

    const deleteBoard = (noticeId) => {
        if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;
        const token = localStorage.getItem("token");
        axios.post("http://localhost/board/delete", null, {
            params: { noticeId: noticeId },
            headers: { Authorization: token }
        })
        .then(res => {
            if (res.data === "yes") {
                alert("✅ 삭제 성공!");
                setBoardModalOpen(false);
            } else {
                alert("❌ 삭제 실패!");
            }
        })
        .catch(err => { console.error(err); });
    };

    return (
        <div className="board-wrapper">
            <div className="board-header">
                <select className="board-select" value={selectedRoom} onChange={boardChange}>
                    <option value="" disabled>회의방을 선택하세요</option>
                    {roomlist && roomlist.length > 0 ? (
                        roomlist.map((room) => (
                            <option key={room.roomId} value={room.roomId}>{room.roomTitle}</option>
                        ))
                    ) : (
                        <option value="">참여하신 회의방이 없습니다.</option>
                    )}
                </select>
                <button className="register-btn" onClick={boardcreate}>등록</button>
            </div>

            <div className="board-summary">
                전체 공지사항 <span>(총 {boardlist ? boardlist.length : 0}건)</span>
            </div>

            {/* 핵심: 테이블을 감싸는 영역에 고정 높이 스타일을 적용해 (Inline style or CSS) */}
            <div className="table-content-area" style={{ minHeight: '400px' }}> 
                <table className="board-table">
                    <thead>
                        <tr>
                            <th className="col-no">No.</th>
                            <th className="col-title">제목</th>
                            <th className="col-author">작성자</th>
                            <th className="col-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((item, i) => (
                                <tr key={item.noticeId}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{item.noticeTitle}</td>
                                    <td>{item.userId}님</td>
                                    <td><button className="view-btn" onClick={() => openDetailModal(item)}>보기</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="no-data">공지사항이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션은 이제 저 위 영역 덕분에 위치가 딱 고정될거야 */}
            <div className="pagination-container">
                <ul className="pagination-list">
                    <li 
                        className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </li>

                    {pageNumbers.map(number => (
                        <li 
                            key={number} 
                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </li>
                    ))}

                    <li 
                        className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </li>
                </ul>
            </div>

            {/* 등록 모달 */}
            {createModal && (
                <div className="custom-alert-overlay">
                    <div className="custom-alert-box">
                        <div className="alert-header">공지사항 등록</div>
                        <div className="alert-body">
                            <div className="input-group">
                                <label>공지사항 제목</label>
                                <input type="text" className="alert-input" value={boardtitle} onChange={(e) => setBoardtitle(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>첨부 파일</label>
                                <input type="file" id="file-upload" className="file-input-hidden" onChange={handleFileChange} />
                                <label htmlFor="file-upload" className="file-upload-label">파일 선택</label>
                                <span className="file-name-display">{boardfile ? boardfile.name : "선택된 파일 없음"}</span>
                            </div>
                            <div className="input-group">
                                <label>공지사항 내용</label>
                                <textarea className="alert-area" value={boardcontent} onChange={(e) => setBoardcontent(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="alert-footer">
                            <button className="alert-btn cancel" onClick={() => setCreateMoal(false)}>취소</button>
                            <button className="alert-btn confirm" onClick={createboard}>생성하기</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 상세 모달 */}
            {boardModalOpen && selectedBoard && (
                <div className="custom-alert-overlay">
                    <div className="custom-alert-box detail-modal">
                        <div className="detail-header">
                            <span>{selectedBoard.noticeTitle}</span>
                            {selectedBoard.userId === currentLoginUser && (
                                <button className="delete-btn" onClick={() => deleteBoard(selectedBoard.noticeId)}>삭제</button>
                            )}
                        </div>
                        <div className="alert-body">
                            <div className="input-group">
                                <label>작성자</label>
                                <div className="detail-value-field"><strong>{selectedBoard.userId}</strong> 님</div>
                            </div>
                            <div className="input-group">
                                <label>공지 내용</label>
                                <div className="detail-value-field detail-content-area">
                                    {selectedBoard.base64Image && (
                                        <div className="image-box" style={{ textAlign: 'center', padding: '20px' }}>
                                            <img src={selectedBoard.base64Image} alt="첨부파일" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                                            <hr style={{ margin: '20px 0', borderTop: '1px solid #eee' }} />
                                        </div>
                                    )}
                                    <div className="text-content">{selectedBoard.noticeContent}</div>
                                </div>
                            </div>
                        </div>
                        <div className="alert-footer">
                            <button className="alert-btn confirm" onClick={() => { setBoardModalOpen(false); setSelectedBoard(null); }}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BoardList;