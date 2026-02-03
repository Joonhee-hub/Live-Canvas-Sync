package kr.or.ddit.mapper;

import kr.or.ddit.vo.ScheduleVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SchMapper {

    // 일정 등록
    public int create(ScheduleVO scheduleVO);

    // 일정 ㅜㄹ러오기
    public List<ScheduleVO> mysch(String userId);

    // 삭제
    public int delete(ScheduleVO scheduleVO);

    // 일주일 일정
    public List<ScheduleVO> weeksch(String userId);
}
