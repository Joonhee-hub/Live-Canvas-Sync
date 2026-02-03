package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.BoardMapper;
import kr.or.ddit.service.BoardService;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.RoomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardServiceimpl implements BoardService {

    @Autowired
    BoardMapper boardMapper;

    // 방목록 불러오기
    @Override
    public List<RoomVO> roomlist(String userId) {
        return this.boardMapper.roomlist(userId);
    }

    // 해당 방의 공지사항 List
    @Override
    public List<BoardVO> roomboard(String roomId) {
        return this.boardMapper.roomboard(roomId);
    }

    // insert
    @Override
    public int createboard(BoardVO boardVO) {
        return this.boardMapper.createboard(boardVO);
    }

    // 공지사항 상세보기
    @Override
    public BoardVO detail(String noticeId) { return this.boardMapper.detail(noticeId); }

    // 공지사항 삭제
    @Override
    public int delete(String noticeId) { return this.boardMapper.delete(noticeId);}
}
