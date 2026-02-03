package kr.or.ddit.controller;

import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.service.BoardService;
import kr.or.ddit.util.JwtUtill;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.RoomVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BoardController {

    @Autowired
    JwtUtill jwtutill;

    @Autowired
    BoardService boardService;

    // 공지사항을 볼 회의방 선택할 때
    @GetMapping("/roomlist")
    public List<RoomVO> roomlist(@RequestHeader(value = "Authorization") String token) {

        String userId = jwtutill.getUserIdFromToken(token);
        log.info("roomlist 왔다몽");

        List<RoomVO> result = this.boardService.roomlist(userId);

        return result;
    }

    // 해당 회의방을 클릭 했을 때 공지사항 List
    @GetMapping("/roomboard")
    public List<BoardVO> roomboard(@RequestHeader(value = "Authorization") String token,
                                   @RequestParam("roomId") String roomId) {
        String userId = jwtutill.getUserIdFromToken(token);

        log.info("roomId : ", roomId);

        List<BoardVO> boardVOList = this.boardService.roomboard(roomId);
        log.info("boardVOList : ", boardVOList);
        return boardVOList;
    }

    // 공지사항 등록
    @PostMapping("/createboard")
    public String createboard(@RequestHeader(value = "Authorization") String token, BoardVO boardVO) {
        String userId = jwtutill.getUserIdFromToken(token);

        boardVO.setUserId(userId);
        int result = 0;

        // file : 이게 진짜 file 객체
        MultipartFile file = boardVO.getNoticeFile();

        if(file != null && !file.isEmpty()) {
            // 업로드 될 폴더 경로 설정
            String uploadFolder = "D:\\JMong";

            File folder = new File(uploadFolder);
            if (!folder.exists()) {
                folder.mkdirs(); // 폴더가 없으면 생성
            }

            // 파일명
            String fileName = file.getOriginalFilename();


            // 어디에 저장 될지 ?
            File saveFile = new File(uploadFolder, fileName);


            try {
                //내가 원하는 진짜 폴더에 파일 형태로 저장
                file.transferTo(saveFile);
                boardVO.setNoticeFileName(fileName);

                log.info("boardVO 보내기 전 : {}", boardVO);
                result = this.boardService.createboard(boardVO);

            } catch (IllegalStateException | IOException e) {
                log.error(e.getMessage());
            }
        } else {
            result = this.boardService.createboard(boardVO);

        }


        if(result > 0) {
            return "yes";
        }
        else {
            return "no";
        }
    }

    @GetMapping("/detail")
    public BoardVO detail(@RequestParam("noticeId") String noticeId) {
        log.info("상세보기 요청 ID: {}", noticeId);

        BoardVO boardVO = this.boardService.detail(noticeId);

        // 2. 파일명이 있다면 하드디스크에서 파일을 찾아 Base64로 
        if (boardVO != null && boardVO.getNoticeFileName() != null) {
            try {
                String uploadFolder = "D:\\JMong\\";
                File file = new File(uploadFolder + boardVO.getNoticeFileName());

                if (file.exists()) {
                    // 파일을 바이트 배열로 읽어와서 Base64 문자열로 변환
                    byte[] fileContent = Files.readAllBytes(file.toPath());
                    String base64String = Base64.getEncoder().encodeToString(fileContent);

                    // 파일의 MIME 타입을 자동으로 알아내기 (image/jpeg, image/png 등)
                    String mimeType = Files.probeContentType(file.toPath());

                   
                    // VO에 base64Image라는 필드가 선언
                    boardVO.setBase64Image("data:" + mimeType + ";base64," + base64String);
                    log.info("이미지 Base64 변환 완료! (Size: {} bytes)", fileContent.length);
                }
            } catch (Exception e) {
                log.error("이미지 변환 중 에러 발생: {}", e.getMessage());
            }
        }
        return boardVO;
    }

    @PostMapping("/delete")
    public String delete(
            @RequestParam("noticeId") String noticeId,
            @RequestHeader(value = "Authorization", required = false) String token
    ) {
        //  토큰 없으면  컷 
        if (token == null || token.isEmpty()) return "need_login";

        //  토큰에서 유저 ID 추출 
        String currentUserId = jwtutill.getUserIdFromToken(token);

        //  데이터 조회
        BoardVO board = boardService.detail(noticeId);
        if (board == null) return "not_found";

        // 본인 확인 (작성자 검증)
        if (!board.getUserId().equals(currentUserId)) return "no_auth";

        //  실제 파일 삭제
        if (board.getNoticeFileName() != null) {
            File file = new File("D:\\JMong\\", board.getNoticeFileName());
            if (file.exists()) file.delete();
        }

        // 6. DB 삭제 진행
        int result = boardService.delete(noticeId);
        return result > 0 ? "yes" : "no";
    }


}
