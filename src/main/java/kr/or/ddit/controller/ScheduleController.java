package kr.or.ddit.controller;

import kr.or.ddit.service.SchService;
import kr.or.ddit.util.JwtUtill;
import kr.or.ddit.vo.ScheduleVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/sch")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ScheduleController {
    @Autowired
    JwtUtill jwtutill;

    @Autowired
    SchService schService;

    @ResponseBody
    @GetMapping("/mysch")
    public List<ScheduleVO> mysch (@RequestHeader(value = "Authorization") String token) {
        String userId = jwtutill.getUserIdFromToken(token);
        log.info("불러오기 : ");

        List<ScheduleVO> resultList = this.schService.mysch(userId);

        return resultList;
    }

    @ResponseBody
    @PostMapping("/create")
    public String create(@RequestHeader(value = "Authorization") String token, @RequestBody ScheduleVO scheduleVO) {
        String userId = jwtutill.getUserIdFromToken(token);
        log.info("여긴 일정 등록임 ㅎㅎ : {}", userId);

        scheduleVO.setUserId(userId);
        log.info("머징 ? : {}", scheduleVO);

        int result = this.schService.create(scheduleVO);

        if(result > 0) {
            return "ok";
        }
        else {
            return "no";
        }
    }

    @ResponseBody
    @PostMapping("/delete")
    public String delete(@RequestHeader(value = "Authorization") String token,  @RequestParam("scheduleId") String scheduleId) {
        String userId = jwtutill.getUserIdFromToken(token);
        log.info("삭제하김ㅇ {}", scheduleId);

        ScheduleVO scheduleVO = new ScheduleVO();
        scheduleVO.setUserId(userId);
        scheduleVO.setScheduleId(scheduleId);

        int result = this.schService.delete(scheduleVO);
        if(result > 0) {
            return "ok";
        }
        else {
            return "no";
        }
    }

    // 일주일 일정
    @ResponseBody
    @GetMapping("/weeksch")
    public List<ScheduleVO> weeksch(@RequestHeader(value = "Authorization") String token) {
        String userId = jwtutill.getUserIdFromToken(token);
        log.info("아이디 {}", userId);

        List<ScheduleVO> result = this.schService.weeksch(userId);
        log.info("리스트 {}", result);

        return result;
    }


}
