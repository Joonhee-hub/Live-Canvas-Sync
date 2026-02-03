import { Route, Routes } from 'react-router-dom';
import Login from './login/Login.jsx';
import Chat from './chat/chat';

import Main from './main/Main.jsx';
import Room from './page/Room.jsx';
import Schedule from './page/Schedule.jsx';
import Mypage from './page/Mypage.jsx';
import Board from './page/Board.jsx';


function App() {

  return (
      <>
      <Routes>
        {/* "/" 경로로 들어오면 Login 컴포넌트를 보여줌 */}
        <Route path="/" element={<Login/>} />
        <Route path="/chat/:roomId" element={<Chat/>} />
        <Route path="/main" element={<Main/>} />
        <Route path='/room' element={<Room />}/>
        <Route path="/schedule" element={<Schedule/>}/>
        <Route path="/mypage" element={<Mypage/>}/>
        <Route path="/board" element={<Board/>} />
      </Routes>

      </>
  );
}

export default App;
