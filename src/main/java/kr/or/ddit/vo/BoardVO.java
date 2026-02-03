package kr.or.ddit.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class BoardVO {
    private String noticeId;
    private String roomId;
    private String userId;
    private String noticeTitle;
    private String noticeContent;
    private Date noticeSdate;
    private Date noticeUdate;
    @JsonIgnore
    private MultipartFile noticeFile;

    private String base64Image;

    // 2. DB의 notice_file 컬럼에 파일 이름(문자열)을 저장하는 용도
    private String noticeFileName;
}
