package com.backend.domain.member;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Member {
    private Integer memberId;
    private String email;
    private String password;
    private String oldPassword;
    private String passwordCheck;
    private String nickName;
    private String name;
    private String gender;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birth;
    private String address;
    private String phoneNumber;
}
