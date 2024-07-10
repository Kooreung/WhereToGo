package com.backend.WebSocket.sseemitter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

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
        System.out.println("왔구나 오태식이");
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        userEmitters.put(userId, emitter);

        emitter.onCompletion(() -> userEmitters.remove(userId));
        emitter.onTimeout(() -> userEmitters.remove(userId));
        emitter.onError((e) -> userEmitters.remove(userId));
        sendMessageToUser(userId, "왔구나 오태식이");

        return emitter;
    }

    // 메시지가 도착했을 때 호출되는 메서드
    public void sendMessageToUser(Integer userId, String message) {
        SseEmitter emitter = userEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("message").data(message));
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }
    }
}
