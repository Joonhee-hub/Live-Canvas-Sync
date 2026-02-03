package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.RoomMapper;
import kr.or.ddit.service.RoomService;
import kr.or.ddit.vo.RoomUserVO;
import kr.or.ddit.vo.RoomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomServiceimpl implements RoomService {
    @Autowired
    RoomMapper roomMapper;

    // 회의방 리스트
    @Override
    public List<RoomVO> list(RoomUserVO roomUserVO) {
        return this.roomMapper.list(roomUserVO);
    }

    // 회의방 만들기
    @Transactional
    @Override
    public int create(RoomVO roomVO) {

        int result = this.roomMapper.create(roomVO);

        if(result > 0) {
            RoomUserVO roomUserVO = new RoomUserVO();

            // 부모 테이블에 들어간 그 ID를 그대로 세팅 
            roomUserVO.setRoomId(roomVO.getRoomId());

            roomUserVO.setUserId(roomVO.getHost());

            this.roomMapper.createhost(roomUserVO);
        }
        return result;
    }

    // 회의방 참가 신청
    @Override
    public int join(RoomUserVO roomUserVO) {
        return this.roomMapper.join(roomUserVO);
    }

    // 회의방 참가 신청 List
    @Override
    public List<RoomVO> joinlist(String userId) {
        return this.roomMapper.joinlist(userId);
    }

    // 회의방 유저 강퇴
    @Override
    public int deleteRoomUser(int roomId, String userId) {
        return this.roomMapper.deleteRoomUser(roomId, userId);
    }

    // 회의방 승인 처리
    @Override
    public int updateRoomUser(int roomId, String userId, String status) {
        return this.roomMapper.updateRoomUser(roomId, userId, status);
    }
    // 일반 유저의 퇴장
    @Override
    public int exitRoom(int roomId, String userId) {
        return this.roomMapper.exitRoom(roomId, userId);
    }

    // 방장이 방을 폭파
    @Transactional
    @Override
    public int destroyRoom(int roomId) {
        this.roomMapper.deleteRoomUsersByRoomId(roomId);

        int result = this.roomMapper.destroyRoom(roomId);

        return result;
    }


}
