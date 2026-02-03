package kr.or.ddit.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    // 1. 방 번호(roomId)별로 세션 관리
    // List 대신 Map을 써서 <유저아이디, 세션> 구조로 저장하면 중복 인원 문제가 사라짐
    private final Map<String, Map<String, WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    // 주소창(/ws/chat/1)에서 roomId만 뽑아내는 메서드
    private String getRoomId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    // 세션에서 사용자 ID를 안전하게 꺼내오는 메서드
    private String getUserId(WebSocketSession session) {
        // 인터셉터를 통해 담아둔 userId를 꺼내거나, 없으면 세션 ID를 사용
        Object userId = session.getAttributes().get("userId");
        return (userId != null) ? userId.toString() : session.getId();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = getRoomId(session);
        String userId = getUserId(session);

        // 2. 해당 방 주머니가 없으면 새로 만들고, 유저 아이디를 키로 세션 저장
        // 이렇게 하면 같은 아이디로 접속 시 기존 유령 세션은 자동으로 덮어짐
        roomSessions.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>()).put(userId, session);

        log.info("[입장] 방번호: {} | 유저: {} | 현재 방 인원: {}", roomId, userId, roomSessions.get(roomId).size());
        broadcastUserCount(roomId);
    }



    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String roomId = getRoomId(session);

        // 3. 내가 속한 방(roomId)에 있는 사람들한테만 메시지 전파
        Map<String, WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            for (WebSocketSession sess : sessions.values()) {
                if (sess.isOpen()) {
                    synchronized (sess) { sess.sendMessage(message); }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = getRoomId(session);
        String userId = getUserId(session);

        Map<String, WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            // 정확히 내 아이디에 해당하는 세션만 제거
            sessions.remove(userId);
            if (sessions.isEmpty()) roomSessions.remove(roomId); // 빈 방은 삭제
        }

        log.info("[퇴장] 방번호: {} | 유저: {} | 남은 인원: {}", roomId, userId, sessions != null ? sessions.size() : 0);
        broadcastUserCount(roomId);
    }




    private void broadcastUserCount(String roomId) {
        Map<String, WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null) return;

        // 현재 세션 수 (중복 제거된 Map의 크기)
        int count = sessions.size();
        String countJson = "{\"type\":\"COUNT\", \"count\":" + count + "}";


        for (WebSocketSession sess : sessions.values()) {
            try {
                if (sess.isOpen()) {
                    synchronized (sess) { sess.sendMessage(new TextMessage(countJson)); }
                }
            } catch (Exception e) {
                log.error("인원수 전송 실패: {}", e.getMessage());
            }
        }
    }
}