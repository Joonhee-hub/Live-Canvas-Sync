package kr.or.ddit.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "*")
public class TestController {

    @PostMapping("/login")
    public String login(@RequestBody Map<String, Object> data) { // 또는 VO 클래스
        log.info("로그인 요청 아이디: " + data.get("userId"));
        log.info("로그인 요청 비번: " + data.get("userPass"));
        return "Welcome, " + data.get("userId") + "!";
    }
}
