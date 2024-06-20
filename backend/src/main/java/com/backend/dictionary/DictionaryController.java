package com.backend.dictionary;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/name")
public class DictionaryController {

    private final WebClient webClient = WebClient.create();

    @GetMapping("create")
    public ResponseEntity<String> createName() {
        String apiUrl = "https://stdict.korean.go.kr/api/search.do?key=37E2AD18AFF9C7F985C7B15A15C90E3B&advanced=y&cat=24&q=동물";
        String response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok(response);
    }
}
