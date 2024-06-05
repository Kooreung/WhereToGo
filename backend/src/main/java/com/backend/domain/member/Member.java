package com.backend.domain.member;

import lombok.Data;

import java.util.Date;

@Data
public class Member {
    private Integer memberId;
    private String email;
    private String password;
    private String nickName;
    private String name;
    private String gender;
    private Date birth;
    private String address;
    private String phoneNumber;
}
