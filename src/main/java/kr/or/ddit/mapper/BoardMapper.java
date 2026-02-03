package kr.or.ddit.mapper;

import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.RoomVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {
    // 방목록 불러오기
    public List<RoomVO> roomlist(String userId);

    // 해당 방의 공지사항 List
    public List<BoardVO> roomboard(String roomId);

    // inesrt
    public int createboard(BoardVO boardVO);
    // 공지사항 상세보기
    public BoardVO detail(String noticeId);
    // 공지사항 삭제
    public int delete(String noticeId);
}
