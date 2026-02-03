package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.UserMapper;
import kr.or.ddit.service.UserService;

import kr.or.ddit.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper usermapper;

    // 로그인
    @Override
    public UserVO login(UserVO userVO) {
        return usermapper.login(userVO);
    }

    // 회원가입
    @Override
    public int create(UserVO userVO) {
        return usermapper.create(userVO);
    }

    // ID중복체크
    @Override
    public int checkId(String userId) {
        return usermapper.checkId(userId);
    }

    // 마이페이지 첫 불러오기
    @Override
    public UserVO getMyPage(String userid) {
        return usermapper.getMyPage(userid);
    }

    // 프로필 수정
    @Override
    public int profileUpdate(UserVO uservo) {
        return usermapper.profileUpdate(uservo);
    }

    // 닉네임 수정
    @Override
    public int nicknameUpdate(UserVO uservo) {
        return usermapper.nicknameUpdate(uservo);
    }
}
