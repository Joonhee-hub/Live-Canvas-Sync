package kr.or.ddit.service;

import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.RoomVO;

import java.util.List;

public interface BoardService {
    // 방목록 불러오기
    public List<RoomVO> roomlist(String userId);
    // 해당 방의 공지사항 List
    public List<BoardVO> roomboard(String roomId);
    // insert
    public int createboard(BoardVO boardVO);
    // 공지사항 상세보기
    public BoardVO detail(String noticeId);
    // 공지사항 삭제
    public int delete(String noticeId);
}
