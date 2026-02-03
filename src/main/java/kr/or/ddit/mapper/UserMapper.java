package kr.or.ddit.mapper;

import kr.or.ddit.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    // 로그인
    public UserVO login(UserVO userVO);
    // 회원가입
    public int create(UserVO userVO);
    // ID중복체크
    public int checkId(String userId);
    // 마이페이지
    public UserVO getMyPage(String userid);
    // 프로필 수정
    public int profileUpdate(UserVO uservo);
    // 닉네임 수정
    public int nicknameUpdate(UserVO uservo);
}
