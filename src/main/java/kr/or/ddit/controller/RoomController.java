package kr.or.ddit.controller;

import kr.or.ddit.service.RoomService;
import kr.or.ddit.util.JwtUtill;
import kr.or.ddit.vo.RoomUserVO;
import kr.or.ddit.vo.RoomVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RoomController {
    @Autowired
    JwtUtill jwtutill;

    @Autowired
    RoomService roomService;


    // 방목록 불러오기
    @GetMapping("/list")
    public List<RoomVO> list(@RequestHeader(value = "Authorization") String token) {
        log.info("list->token : {}", token);

        String userId = jwtutill.getUserIdFromToken(token);
        log.info("list->userid : {}", userId);

        RoomUserVO roomUserVO = new RoomUserVO();
        roomUserVO.setUserId(userId);

        List<RoomVO> list = this.roomService.list(roomUserVO);
        log.info("list->list : {}", list.size());

        return list;
    }

    // 회의방 생성
    @ResponseBody
    @PostMapping("/create")
    public String create(@RequestHeader(value = "Authorization") String token,
                         @RequestBody RoomVO roomVO) {
        log.info("create => token : {}", token);
        log.info("create => roomVO : {}", roomVO);

        String userId = jwtutill.getUserIdFromToken(token);
        log.info("create->userid : {}", userId);

        roomVO.setHost(userId);
        int res = this.roomService.create(roomVO);

        if(res > 0) {
            return "yes";
        }
        else {
            return "no";
        }
    }

    // 회의방 코드로 참여하기
    @PostMapping("/join")
    public String join (@RequestHeader(value = "Authorization") String token,
                        @RequestBody RoomUserVO roomUserVO) {
        log.info("create => token : {}", token);
        log.info("create => roomVO : {}", roomUserVO);

        String userId = jwtutill.getUserIdFromToken(token);
        log.info("create->userid : {}", userId);

        roomUserVO.setUserId(userId);

        int res = this.roomService.join(roomUserVO);

        if(res > 0) {
            return "yes";
        }
        else {
            return "no";
        }
    }

    // 회의방 신청중인 List 부르기
    @GetMapping("/joinlist")
    public List<RoomVO> joinlist (@RequestHeader(value = "Authorization") String token) {
        String userId = jwtutill.getUserIdFromToken(token);

        List<RoomVO> joinlist = this.roomService.joinlist(userId);

        return joinlist;
    }
    /**
     * 유저 삭제 (추방/거절)
     * DELETE /room/{roomId}/{userId}
     */
    @DeleteMapping("/{roomId}/{userId}")
    public String deleteRoomUser(
            @PathVariable int roomId,
            @PathVariable String userId) {
        log.info("deleteRoomUser-> Room {}, ID {}", roomId, userId);

        int result = roomService.deleteRoomUser(roomId, userId);
        return result > 0 ? "yes" : "no";
    }

    /**
     * 유저 상태 변경 (승인)
     * PATCH /room/status
     */

    @PatchMapping("/status")
    public String updateRoomUser(@RequestBody Map<String, Object> params) {
        // Map으로 받아서 파싱
        int roomId = Integer.parseInt(params.get("roomId").toString());
        String userId = (String) params.get("userId");
        String status = (String) params.get("userStatus");

        log.info("updateRoomUser-> Room {}, ID {}, Status {}", roomId, userId, status);

        int result = roomService.updateRoomUser(roomId, userId, status);
        return result > 0 ? "yes" : "no";
    }

    @DeleteMapping("/exit/{roomId}/{userId}")
    public String exitRoom(@PathVariable int roomId, @PathVariable String userId) {
        log.info("exitRoom-> Room , ID {}", roomId , userId);

        int result = roomService.exitRoom(roomId, userId);

        return result > 0 ? "yes" : "no";
    }
    @DeleteMapping("/destroy/{roomId}")
    public String destroyRoom(@PathVariable int roomId) {
        log.info("exitRoom-> Room {}", roomId );

        int result = roomService.destroyRoom(roomId);

        return result > 0 ? "yes" : "no";
    }

}
