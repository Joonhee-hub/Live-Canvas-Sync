package kr.or.ddit.service;

import kr.or.ddit.vo.ScheduleVO;

import java.util.List;

public interface SchService {

    // 일정 등록
    public int create(ScheduleVO scheduleVO);

    // 첫 화면 (일정 불러오기)
    public List<ScheduleVO> mysch(String userId);

    // 삭제
    public int delete(ScheduleVO scheduleVO);

    // 일주일 일정
    public List<ScheduleVO> weeksch(String userId);
}
