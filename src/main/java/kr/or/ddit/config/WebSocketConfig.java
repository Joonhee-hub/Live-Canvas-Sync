package kr.or.ddit.config;

import kr.or.ddit.handler.WebSocketHandler;
import kr.or.ddit.util.JwtUtill;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket //이 서버는 웹소켓 기능을 사용할 것임을 선언
@RequiredArgsConstructor //WebSocketHandler을 자동으로 가져와 이 설정 파일에 꽃아주는 의존성 어노테이션
public class WebSocketConfig implements WebSocketConfigurer {
    private  final WebSocketHandler webSocketHandler;
    private final JwtUtill jwtUtill;
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 🚀 핵심 포인트: 주소에 {roomId}를 써서 경로 변수를 활성화!
        registry.addHandler(webSocketHandler, "/ws/chat/{roomId}")
                // 💡 HTTP 세션(로그인 정보 등)을 WebSocket 세션으로 복사해주는 갓-터셉터!
                .addInterceptors(new JwtHandshakeInterceptor(jwtUtill))
                .setAllowedOrigins("*");
    }
}
