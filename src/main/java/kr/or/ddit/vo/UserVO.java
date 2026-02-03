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
public class UserVO {
    private String userId;
    private String userPass;
    private String userName;
    private String userPhone;
    private String userEmail;
    private String userNick;
    private String userProfile;
    private Date userRegDate;
    private Date userUpdateDate;
    private Date userWithdrawDate;
}
