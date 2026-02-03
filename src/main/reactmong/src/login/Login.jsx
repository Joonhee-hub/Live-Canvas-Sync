import axios from "axios";
import { useState } from "react"
import './Login.css'
import { useNavigate } from "react-router-dom";


export default function Login() {
    // 로그인,회원가입 (아이디, 비밀번호) state
    const [login, setLogin] = useState({ userId: '', userPass:''});
    const [loginState, setLoginState] = useState(false);
    const [create, setCreate] = useState({
        userId: '', userPass: '', userName: '', userPhone: '', userEmail: ''
    });
    const [isIdChecked, setIsIdChecked] = useState(false);
    const navigate = useNavigate();

    const signUp = () => {
        setLoginState(true);
    }

    const signIn = () => {
        setLoginState(false);
    }


    const handleChange = (e) =>{
        setLogin({...login, [e.target.name]:e.target.value});
    };

    // 로그인 하는구
    const handleLogin = (e)=>{
        e.preventDefault();

        //스프링부트로 로그인시도;
        axios.post("http://192.168.35.23/user/login",login)
            .then(res => {
                console.log(res);
                if(res.data.success === "yes") {
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("username",res.data.username);
                    localStorage.setItem("userId", res.data.userId);
                    navigate('/main', { replace:true})
                } else if(res.data.success === "no") {
                    alert("회원이 존재하지 않습니다.");
                }
        })
        .catch(err => console.error("로그인 에러 : ",err))
    }
    // 회원가입 입력값 변경 핸들러
    const handleCreateChange = (e) => {
        setCreate({...create, [e.target.name]: e.target.value});
        if(e.target.name === 'userId') setIsIdChecked(false); // 아이디 바꾸면 중복확인 다시
    };
    // 중복 확인
    const checkId = () => {
        if(!create.userId) return alert("아이디를 입력해주세요");

        axios.get(`http://192.168.35.23/user/checkId?userId=${create.userId}`)
            .then(res => {
                if(res.data.result === "no") {
                    alert("사용 가능한 아이디 입니다");
                    setIsIdChecked(true);
                } else {
                    alert("이미 등록 된 아이디 입니다");
                }
            })
            .catch(err => console.error(err));
    };

    // 회원가입
    const handleCreate = (e)=>{
        e.preventDefault();
        if(!isIdChecked) return alert("아이디 중복 확인을 해주세요");

        axios.post("http://192.168.35.23/user/create", create)
            .then(res => {
                if(res.data.result === "success") {
                    alert("회원가입을 축하드립니다.");
                    // 회원가입 정보 초기화
                    setCreate({
                        userId: '',
                        userPass: '',
                        userName: '',
                        userPh: '',
                        userEmail: ''
                    });

                    // 중복 확인 상태 초기화
                    setIsIdChecked(false);
                    signIn(); // 가입 성공시 로그인 화면으로 이동
                }else{
                    alert("이미 가입된 회원입니다.");
                }
            })
            .catch(err => {
                console.error("가입 에러: ", err);
                alert("서버와 통신 중 문제가 발생했습니다.");
            });
    }


    return (
            <div className={`container ${loginState ? "right-panel-active" : ""}`} id="container">

                {/* 여기는 회원가입 하는 컨테이너 */}
                <div className="form-container sign-up-container">
                <form onSubmit={handleCreate}> {/* 핸들러 연결 */}
                    <h1>Sign Up</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: '30px' }}>
                        <input 
                            type="text" 
                            name="userId" 
                            placeholder="ID" 
                            style={{ width: '220px' }} 
                            onChange={handleCreateChange} 
                            required 
                        />
                        <button 
                            type="button" 
                            onClick={checkId} 
                            style={{ 
                                width: '100px', 
                                height: '40px',  
                                padding: '0 10px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap' 
                            }}
                        >
                            중복확인
                        </button>
                    </div>
                    <input type="password" name="userPass" placeholder="Password" onChange={handleCreateChange} required  style={{marginTop:'10px'}} />
                    <input type="text" name="userName" placeholder="Name" onChange={handleCreateChange} required style={{marginTop:'10px'}}  />
                    <input type="text" name="userPhone" placeholder="Phone" onChange={handleCreateChange} required style={{marginTop:'10px'}}  />
                    <input type="email" name="userEmail" placeholder="Email" onChange={handleCreateChange} required style={{marginTop:'10px'}}  />
                    <button type="submit" style={{marginTop:'30px'}}>Sign Up</button>
                </form>
            </div>
                
                {/* 여기는 로그인 하는 컨테이너 ! */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1>Sign in</h1>
                        <br /><br />
                        <input type="text" name="userId" placeholder="ID" onChange={handleChange} required  />
                        <input type="password" name="userPass" placeholder="Password" onChange={handleChange} required  style={{marginTop: '10px'}}/>
                        <button type="submit" style={{marginTop: '40px'}}>Sign In</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p id="pid">To keep connected with us please login with your personal info</p>
                           
                            <button className="ghost" id="signIn" onClick={signIn}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p id="pid">Enter your personal details and start journey with us</p>
                        
                            <button className="ghost" id="signUp" onClick={signUp}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
    )
}

