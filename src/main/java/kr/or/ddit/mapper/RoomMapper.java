package kr.or.ddit.mapper;

import kr.or.ddit.vo.RoomUserVO;
import kr.or.ddit.vo.RoomVO;
import kr.or.ddit.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoomMapper {
    // 회의방 리스트
    public List<RoomVO> list(RoomUserVO roomUserVO);

    // 회의방 ㅊ추가
    public int create(RoomVO roomVO);

    // 방장 추가
    public int createhost(RoomUserVO roomUserVO);
    // 방 참여하기
    public int join(RoomUserVO roomUserVO);
    // 회의방 신청 List
    public List<RoomVO> joinlist(String userId);

    // 회의방 유저 강퇴
    public int deleteRoomUser(int roomId, String userId);
    // 회의방 승인 처리
    public int updateRoomUser(int roomId, String userId, String status);

    // 일반 유저의 퇴장
    public int exitRoom(int roomId, String userId);
    // 방장이 방을 폭파
    public int destroyRoom(int roomId);
    // 방장이 방을 없애기전 자식 테이블 유저들먼저 삭제
    public void deleteRoomUsersByRoomId(int roomId);
}
