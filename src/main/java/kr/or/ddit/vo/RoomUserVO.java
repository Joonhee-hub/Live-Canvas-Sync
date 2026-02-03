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
public class RoomUserVO {
    private String userId;
    private String roomId;
    private String userStatus;
    private Date joinDate;
    private String roomInviteCode;

}
