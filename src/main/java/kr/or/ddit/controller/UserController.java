package kr.or.ddit.controller;

import kr.or.ddit.service.UserService;
import kr.or.ddit.util.JwtUtill;
import kr.or.ddit.vo.UserVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    JwtUtill jwtutill;

    //회원 가입
    @PostMapping("/create")
    public Map<String, Object> create(@RequestBody UserVO userVO) { // 또는 VO 클래스
        log.info("create -> userVO : {}", userVO);
        Map<String, Object> map = new HashMap<String, Object>();

        // 회워가입시 DB에 저장
        int result = this.userService.create(userVO);
        log.info("create -> result : {}", result);

        if (result > 0) {
            map.put("result", "success");
        }else {
            map.put("result", "failed");
        }
        return map;
    }

    //중복 확인
    @ResponseBody
    @GetMapping("/checkId")
    public Map<String, Object> checkId(@RequestParam(value = "userId") String userId) {
        log.info("checkId -> 요청들어온 ID : {}", userId);

        Map<String, Object> map = new HashMap<String, Object>();

        //DB에서 조회
        int result = this.userService.checkId(userId);

        if (result == 0) {
            // 중복된 아이디가 없을 때
            map.put("result", "no");
        } else {
            // 이미 아이디가 있을 때
            map.put("result", "yes");
        }
        return map;
    }

    // 로그인
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserVO userVO) {
        log.info("login -> userVO : {}", userVO);
        Map<String, String> response = new HashMap<>();

        // 회원정보가 있으면 result는 반환값 : VO
        UserVO resultUserVO = this.userService.login(userVO);
        log.info("login -> resultUserVO : {}", resultUserVO);


        if(resultUserVO != null) {
            // 1이면 토큰부여
            String token = jwtutill.generateToken(resultUserVO.getUserId());

            response.put("success", "yes");
            response.put("token",token);
            response.put("username",resultUserVO.getUserName());
            response.put("userId", resultUserVO.getUserId());
            return response;
        } else {
            response.put("success", "no");
            return response;
        }
    }

    // 마이페이지 입장 시 정보 요청
    @GetMapping("/mypage")
    public UserVO getMyPage(@RequestHeader(value ="Authorization") String token) {
        log.info("mypage -> token : {}", token);

        String userid = jwtutill.getUserIdFromToken(token);
        log.info("mypage -> userid : {}", userid);

        UserVO uservo = this.userService.getMyPage(userid);
        log.info("mypage -> uservo : {}", uservo);

        return uservo;
    }


    // 마이페이지에서 프로필 수정
    @PatchMapping("/profile")
    public int profileUpdate(@RequestHeader(value = "Authorization") String token,
                             @RequestBody Map<String, String> data) { // Map으로 받기

        log.info("token : {}", token);

        String profileContent = data.get("userProfile");
        log.info("추출된 프로필 내용 : {}", profileContent);

        // 1. 토큰 아이디 값 추출~
        String userid = jwtutill.getUserIdFromToken(token);

        // vo에 담아버리깃
        UserVO uservo = new UserVO();
        uservo.setUserId(userid);
        uservo.setUserProfile(profileContent);

        // 3. 업데이트 실행
        int resultprofile = this.userService.profileUpdate(uservo);

        return resultprofile;
    }

    // 마이페이지에서 닉네임
    @PatchMapping("/nickname")
    public int nicknameUpdate(@RequestHeader(value = "Authorization") String token,
                             @RequestBody Map<String, String> data) { // Map으로 받기

        log.info("token : {}", token);

        String userNickContent = data.get("userNick");
        log.info("닉네임내용 : {}", userNickContent);

        // 1. 토큰 아이디 값 추출~
        String userid = jwtutill.getUserIdFromToken(token);

        // vo에 담아버리깃
        UserVO uservo = new UserVO();
        uservo.setUserId(userid);
        uservo.setUserNick(userNickContent);

        // 3. 업데이트 실행
        int resultnickname = this.userService.nicknameUpdate(uservo);

        return resultnickname;
    }

}
