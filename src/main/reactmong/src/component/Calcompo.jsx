import { forwardRef, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/calcompo.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import axios from 'axios';

const locales = { 'ko': ko };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });



const eventPropGetter = () => {
  const randomHue = Math.floor(Math.random() * 360);
  return {
    style: {
      backgroundColor: `hsl(${randomHue}, 80%, 85%)`,
      color: '#333',
      border: 'none'
    }
  };
};



function Calcompo() {
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  // 2. 모달에서 입력받을 새 일정 상태
  const [newEvent, setNewEvent] = useState({ scheduleTitle: '', scheduleStart: null, scheduleEnd: null });

  const [currentDate, setCurrentDate] = useState(new Date());

  // 모달 ON/OFF
  const [modalOpen, setModalOpen] = useState(false);

  const list = () => {
    let isCancelled = false; // 플래그 생성
    const token = localStorage.getItem("token");

    axios.get("http://localhost/sch/mysch", {
        headers: { Authorization: token }
    })
    .then(res => {
      if(!isCancelled) {
          const resultList = res.data.map(item => ({
            ...item,
            title : item.scheduleTitle,
            start : new Date(item.scheduleStart),
            end : new Date(item.scheduleEnd)
        }))

        console.log("머지 ?", resultList);
        setEvents(resultList);
      }
    })
     .catch(err => console.error("방 목록 로드 실패! :", err));

    return () => {
      isCancelled = true;
    };
  }

  useEffect(()=> {
    list();
  },[])



  const createsc = () => {
      setModalOpen(pre => !pre)
  }
  

  // 진짜 일정 등록 btn !
  const create = () => {
    
    console.log(token);

    //  토큰 전달
    axios.post("http://localhost/sch/create",newEvent, {
        headers: { Authorization: token }
    })
    .then(res => {
        console.log("받아온 방 리스트:", res.data);

        if(res.data === "ok") {
          alert("등록 성공!");
          setModalOpen(false);
          setNewEvent({ scheduleTitle: '', scheduleStart: null, scheduleEnd: null });
          list();
        } else {
          alert("등록 실패!");
        }  
    })
     .catch(err => console.error("방 목록 로드 실패! :", err));
  }

  // 삭제까지 해보깡?
  const handleDeleteEvent = (e) => {
    if (window.confirm(`${e.scheduleTitle} 일정을 삭제할까요 ?`)) {
       //  토큰 전달
      axios.post("http://localhost/sch/delete",null, {
          params: {
            "scheduleId" : e.scheduleId
          },
          headers: { Authorization: token }
      })
      .then(res => {
          if(res.data === "ok") {
            alert("삭제 성공!");
            list();
          } else {
            alert("삭제 실패!");
          }  
      })
     .catch(err => console.error("방 목록 로드 실패! :", err));
    } 
    else {
      return false;
    }
  }

  return (
    <div style={{ height: '65vh', margin: '20px' }}>

      <div className="add-event-container">
        <button onClick={createsc} className="btn-add-event" >
           일정 추가 
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}  // << 여기가 데이터를 넣는 방식이라구 함
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        culture="ko"
        onSelectEvent={handleDeleteEvent}
        
        // 오직 'month'만 사용
        views={['month']} 
        defaultView="month"

        // 버튼 이름 한글화 (보기 전환 버튼은 views 설정으로 이미 사라짐)
        messages={{
          previous: '이전',
          today: '오늘',
          next: '다음',
        }}

        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
        
        // 날짜 표시 형식 커스텀 (필요시)
        formats={{
            monthHeaderFormat: 'yyyy년 MM월',
        }}
      />
     
       {/* 일정 추가 Modal 시작 */}
        {modalOpen && (
          <div className="custom-alert-overlay">
            <div className="modal-content">
              <h3>📅 새 일정 추가 📅</h3>
              <input
                type="text"
                placeholder="일정 제목을 입력하세요"
                value={newEvent.scheduleTitle}
                onChange={(e) => setNewEvent({ ...newEvent, scheduleTitle: e.target.value })}
              />

              <div className="date-input-group">
                <label>시작일</label>
                <DatePicker
                  selected={newEvent.scheduleStart}
                  onChange={(date) => setNewEvent({ ...newEvent, scheduleStart: date })}
                  placeholderText="시작일을 선택해주세요"
                  dateFormat="yyyy-MM-dd"
                  locale={ko}
                  
                />
              </div>

              <div className="date-input-group">
                <label>종료일</label>
                <DatePicker
                  selected={newEvent.scheduleEnd}
                  onChange={(date) => setNewEvent({ ...newEvent, scheduleEnd: date })}
                  placeholderText="종료일을 선택해주세요"
                  dateFormat="yyyy-MM-dd"
                  locale={ko}
                />
              </div>

              <div className="button-group">
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>취소</button>
                <button className="btn-confirm" onClick={() => create()}>등록</button>
              </div>
            </div>
          </div>
        )}
      {/* 일정 추가 Modal 끝 */}


    </div>
  );
}

export default Calcompo;