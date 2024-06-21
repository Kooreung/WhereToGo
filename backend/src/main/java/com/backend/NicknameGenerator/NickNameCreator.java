package com.backend.NicknameGenerator;

import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class NickNameCreator {
    private static List<String> adjectives = new ArrayList<>();
    private static List<String> animals = new ArrayList<>();
    private static Random random = new Random();
    private final MemberMapper mapper;

    static {
        // 형용사 리스트 초기화
        adjectives.add("예쁜");
        adjectives.add("아름다운");
        adjectives.add("멋진");
        adjectives.add("귀여운");
        adjectives.add("용감한");
        adjectives.add("지혜로운");
        adjectives.add("강한");
        adjectives.add("기쁜");
        adjectives.add("슬픈");
        adjectives.add("행복한");
        adjectives.add("재미있는");
        adjectives.add("신나는");
        adjectives.add("빠른");
        adjectives.add("느린");
        adjectives.add("큰");
        adjectives.add("작은");
        adjectives.add("넓은");
        adjectives.add("좁은");
        adjectives.add("밝은");
        adjectives.add("어두운");
        adjectives.add("부드러운");
        adjectives.add("딱딱한");
        adjectives.add("시원한");
        adjectives.add("따뜻한");
        adjectives.add("차가운");
        adjectives.add("뜨거운");
        adjectives.add("무서운");
        adjectives.add("귀찮은");
        adjectives.add("즐거운");
        adjectives.add("신비한");
        adjectives.add("지루한");
        adjectives.add("친절한");
        adjectives.add("상냥한");
        adjectives.add("다정한");
        adjectives.add("혼란스러운");
        adjectives.add("피곤한");
        adjectives.add("건강한");
        adjectives.add("아름다운");
        adjectives.add("못생긴");
        adjectives.add("깨끗한");
        adjectives.add("더러운");
        adjectives.add("달콤한");
        adjectives.add("신선한");
        adjectives.add("쓰라린");
        adjectives.add("달콤한");
        adjectives.add("쓴");
        adjectives.add("진실한");
        adjectives.add("거짓된");
        adjectives.add("활기찬");
        adjectives.add("정적인");
        adjectives.add("재미있는");
        adjectives.add("지루한");
        adjectives.add("강력한");
        adjectives.add("약한");
        adjectives.add("신속한");
        adjectives.add("느린");
        adjectives.add("우아한");
        adjectives.add("서툴러");
        adjectives.add("단단한");
        adjectives.add("부서진");
        adjectives.add("활동적인");
        adjectives.add("게으른");
        adjectives.add("활발한");
        adjectives.add("말랐다");
        adjectives.add("습기가 많은");
        adjectives.add("건조한");
        adjectives.add("광란의");
        adjectives.add("정신없는");
        adjectives.add("아늑한");
        adjectives.add("공기가 없는");
        adjectives.add("화려한");
        adjectives.add("노란");
        adjectives.add("푸른");
        adjectives.add("빨간");
        adjectives.add("검은");
        adjectives.add("하얀");
        adjectives.add("회색");
        adjectives.add("보라색");
        adjectives.add("오렌지색");
        adjectives.add("분홍색");
        adjectives.add("밤색");
        adjectives.add("베이지색");
        adjectives.add("은색");
        adjectives.add("금색");
        adjectives.add("청동색");
        adjectives.add("눈부신");
        adjectives.add("어수선한");
        adjectives.add("정돈된");
        adjectives.add("부드러운");
        adjectives.add("굳센");
        adjectives.add("쉬운");
        adjectives.add("어려운");
        adjectives.add("정확한");
        adjectives.add("부정확한");
        adjectives.add("흥미로운");
        adjectives.add("지루한");
        adjectives.add("유용한");
        adjectives.add("무용한");
        adjectives.add("자유로운");
        adjectives.add("구속된");

        // 동물 이름 리스트 초기화
        animals.add("호랑이");
        animals.add("사자");
        animals.add("코끼리");
        animals.add("원숭이");
        animals.add("사슴");
        animals.add("펭귄");
        animals.add("곰");
        animals.add("여우");
        animals.add("고릴라");
        animals.add("악어");
        animals.add("기린");
        animals.add("캥거루");
        animals.add("팬더");
        animals.add("늑대");
        animals.add("사막여우");
        animals.add("파랑새");
        animals.add("복어");
        animals.add("돌고래");
        animals.add("고래");
        animals.add("상어");
        animals.add("거북");
        animals.add("산양");
        animals.add("양");
        animals.add("말");
        animals.add("송아지");
        animals.add("암소");
        animals.add("얼룩말");
        animals.add("흰고래");
        animals.add("비버");
        animals.add("너구리");
        animals.add("아나콘다");
        animals.add("파이프 피쉬");
        animals.add("앵무새");
        animals.add("박쥐");
        animals.add("참새");
        animals.add("도마뱀");
        animals.add("악어");
        animals.add("벌레");
        animals.add("개미");
        animals.add("거미");
        animals.add("해파리");
        animals.add("물고기");
        animals.add("바다거북");
    }

    @Transactional
    public String generateUniqueNicknameAndSave() {
        String nickname = generateNickname();

        // 중복 닉네임 검사
        while (isNicknameExists(nickname)) {
            nickname = generateNickname();
        }

        return nickname;
    }

    private String generateNickname() {
        String adjective = getRandomElement(adjectives);
        String animal = getRandomElement(animals);

        return adjective + animal;
    }

    private String getRandomElement(List<String> list) {
        int index = random.nextInt(list.size());
        return list.get(index);
    }

    private boolean isNicknameExists(String nickname) {
        return mapper.isUsernameExists(nickname);
    }


}
