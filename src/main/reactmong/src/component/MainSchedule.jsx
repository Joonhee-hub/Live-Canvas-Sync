import axios from "axios";
import { useEffect, useState } from "react";
import "../css/main.css"; // CSS 파일 임포트



function MainSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost/sch/weeksch", {
        headers: { Authorization: token }
      })
      .then(res => setSchedule(res.data))
      .catch(err => console.error(err));
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // 결과 예시: 2월 3일 15:00ㅇㄹㅇ
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };



    return (
        <div className="schedule-container">
          <div className="schedule-header">
            <p>
              🗓️ 이번 주 마감 일정이 <span className="count-highlight">{schedule.length}건</span> 남았어요.
            </p>
          </div>
          <div className="schedule-card">
            <table className="schedule-table">
              <colgroup>
                <col className="col-index" />
                <col className="col-title" />
                <col className="col-date" />
              </colgroup>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>일정 내용</th>
                  <th style={{paddingRight: '20px' }}>마감 기한</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length > 0 ? (
                  schedule.map((item, i) => (
                    <tr key={item.scheduleId}>
                      <td className="index-cell">{i + 1}</td> 
                      <td className="title-cell">{item.scheduleTitle}</td>
                      <td className="date-cell">
                        <span className="date-badge">
                          {formatDate(item.scheduleEnd)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-row">🎉 이번 주 일정이 없어요!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
}
 

export default MainSchedule;