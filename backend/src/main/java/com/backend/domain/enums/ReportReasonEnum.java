package com.backend.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportReasonEnum {
    ABUSE("부적절한 언어 사용"),
    PERSONAL_INFORMATION("개인정보 노출"),
    NOT_FIT_THE_LOCATION("위치에 맞지 않는 게시물");

    private final String reason;
}
