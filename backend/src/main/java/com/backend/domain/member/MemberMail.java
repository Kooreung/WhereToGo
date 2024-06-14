package com.backend.domain.member;

import lombok.Data;

@Data
public class MemberMail {
    private String toEmail;
    private String mailTitle;
    private String mailContent;
}
