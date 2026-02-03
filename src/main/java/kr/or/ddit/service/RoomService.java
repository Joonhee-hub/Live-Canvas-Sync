package kr.or.ddit.service;

import kr.or.ddit.vo.RoomUserVO;
import kr.or.ddit.vo.RoomVO;

import java.util.List;

public interface RoomService {
    // 회의방 리스트
    public List<RoomVO> list(RoomUserVO roomUserVO);
    // 회의방 만들기
    public int create(RoomVO roomVO);
    // 회의방 참가 신청
    public int join(RoomUserVO roomUserVO);
    // 회의방 참가 신청 List
    public List<RoomVO> joinlist(String userId);

    // 회의방 유저 강퇴
    public int deleteRoomUser(int roomId, String userId);
    // 회의방 승인 처리
    public int updateRoomUser(int roomId, String userId, String status);
    // 일반 유저의 퇴장
    public int exitRoom(int roomId, String userId);
    // 방장이 방을 폭파
    public int destroyRoom(int roomId);
}