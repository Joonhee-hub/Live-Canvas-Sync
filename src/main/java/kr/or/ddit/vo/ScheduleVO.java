package kr.or.ddit.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ScheduleVO {
    private String scheduleId;
    private String userId;
    private String scheduleTitle;
    private Date scheduleStart;
    private Date scheduleEnd;
}
