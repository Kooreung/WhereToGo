package com.backend.WebSocket.sseemitter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class NotificationController {

    // 사용자별 SseEmitter를 저장하는 Map
    private final Map<Integer, SseEmitter> userEmitters = new ConcurrentHashMap<>();

    // 사용자가 연결을 맺을 때 호출되는 메서드
    @GetMapping("/subscribe/{userId}")
    public SseEmitter subscribe(@PathVariable Integer userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        userEmitters.put(userId, emitter);

        emitter.onCompletion(() -> userEmitters.remove(userId));
        emitter.onTimeout(() -> userEmitters.remove(userId));
        emitter.onError((e) -> userEmitters.remove(userId));
        return emitter;
    }

    // 메시지가 도착했을 때 호출되는 메서드
    public void sendMessageToUser(Integer userId, Integer senderId, String message) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("senderId", senderId);
        data.put("message", message);
        SseEmitter emitter = userEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("message").data(data));
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }
    }

    public void sendState(Integer userId, String message) {
        System.out.println("userid = " + userId);
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("message", message);
        SseEmitter emitter = userEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("message").data(data));
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }
    }
}
