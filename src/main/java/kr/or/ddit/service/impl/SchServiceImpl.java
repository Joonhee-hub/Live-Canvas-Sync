package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.SchMapper;
import kr.or.ddit.service.SchService;
import kr.or.ddit.vo.ScheduleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchServiceImpl implements SchService {
    @Autowired
    SchMapper schMapper;


    // 일정 등록
    @Override
    public int create(ScheduleVO scheduleVO) {
        return this.schMapper.create(scheduleVO);
    }

    // 일정 불러오기
    @Override
    public List<ScheduleVO> mysch(String userId) {
        return this.schMapper.mysch(userId);
    }

    // 삭제
    @Override
    public int delete(ScheduleVO scheduleVO) {
        return this.schMapper.delete(scheduleVO);
    }

    // 일주일 일정
    @Override
    public List<ScheduleVO> weeksch(String userId) {
        return this.schMapper.weeksch(userId);
    }
}
