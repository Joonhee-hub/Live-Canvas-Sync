package kr.or.ddit.service;

import kr.or.ddit.vo.UserVO;

public interface UserService {

    // 로그인 처리
    public UserVO login(UserVO userVO);
    // 회원가입
    public int create(UserVO userVO);
    // ID중복체크
    public int checkId(String userId);
    // 마이페이지 불러오기
    public UserVO getMyPage(String userid);
    // 프로필 수정
    public int profileUpdate(UserVO uservo);
    // 닉네임 수정
    public int nicknameUpdate(UserVO uservo);
}
