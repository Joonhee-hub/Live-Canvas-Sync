import axios from "axios";
import { useEffect, useState } from "react"
import '../css/userpage.css'

function User() {

    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState("");
    const [nick, setNick] = useState("");

    // 토큰
    const token = localStorage.getItem("token")

    useEffect(() => {
        setName(localStorage.getItem("username"));
        ;
        console.log(token);

        axios.get("http://localhost/user/mypage", {
            headers:{
                'Authorization' : token
            }
        })
        .then(res => {
            console.log(res.data);
            setPass(res.data.userPass);
            setPhone(res.data.userPhone);
            setEmail(res.data.userEmail);
            setNick(res.data.userNick);
            setProfile(res.data.userProfile);
        })
        .catch(err => console.error("에러 : ",err))

    },[])

    // 프로필 업데이트
    const profileUpdate = () => {

        const data = {
            userProfile: profile  // 혹은 변수명 그대로 updateprofile
        };

        axios.patch("http://localhost/user/profile", data, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            console.log(res.data);
            if(res.data > 0) {
                alert("프로필이 수정되었습니다 !");
            } else {
                 alert("프로필이 수정 실패 ");
            }
        })
        .catch(err => console.error("에러 : ",err))

    }

    // 닉네임 변경
    const nickUpdate = () => {
        const data = {
            userNick: nick  // 혹은 변수명 그대로 updateprofile
        };

        axios.patch("http://localhost/user/nickname", data, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            console.log(res.data);
            if(res.data > 0) {
                alert("닉네임이 수정되었습니다 !");
            } else {
                 alert("닉네임 수정 실패 ");
            }
        })
        .catch(err => console.error("에러 : ",err))
    }


return (
    <div className="mypage-container">
        <div className="profile-card">
            {/* 상단 프로필 요약 (허전함 방지) */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 className="title" style={{ border: 'none' }}>My Page</h2>
            </div>

            <div className="info-group">
                <div className="info-item">
                    <span className="label">이름</span>
                    <span className="value">{name}</span>
                </div>
                <div className="info-item">
                    <span className="label">닉네임</span>
                    <input className="profile-textarea" value={nick || ""} onChange={(e) => setNick(e.target.value)} style={{width: '150px' , marginRight:'30px'}} />
                    <button className="edit-btn" onClick={ nickUpdate}>변경</button>
                </div>
                <div className="info-item">
                    <span className="label">이메일</span>
                    <span className="value">{email}</span>
                </div>
                <div className="info-item">
                    <span className="label">전화번호</span>
                    <span className="value">{phone}</span>
                </div>
                <div className="info-item">
                    <span className="label">비밀번호</span>
                    <span className="value" style={{ letterSpacing: '2px'}}> ******** </span>
                </div>
                <div className="info-item vertical">
                    <span className="label">프로필 설명</span>
                    <div className="value profile-text">
                        <input className="profile-textarea" value={profile || ""} onChange={(e) => setProfile(e.target.value)} style={{width: '300px' , marginRight:'30px' }} />
                        <button className="edit-btn" onClick={profileUpdate}>변경</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}


export default User