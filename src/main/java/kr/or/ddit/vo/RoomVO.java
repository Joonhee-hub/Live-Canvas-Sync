package kr.or.ddit.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RoomVO {
    private String roomId;
    private String roomTitle;
    private String roomInviteCode;
    private Integer roomAttendees;
    private Date roomDate;
    private String host;

    private List<RoomUserVO> roomUserVOList;
}
