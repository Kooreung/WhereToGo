package com.backend.service.member;

import com.backend.domain.member.MemberMail;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MemberMapper mapper;

    public String createMail(String email) {

        MemberMail passwordMail = new MemberMail();
        String tempPassword = getTempPassword();

        passwordMail.setToEmail(email);
        passwordMail.setMailTitle("임시 비밀번호 안내 메일입니다. ");
        passwordMail.setMailContent(STR."안녕하세요. 임시 비밀번호 안내 메일입니다.\n회원님의 임시 비밀번호는 \{tempPassword} 입니다.\n로그인 후 비밀번호를 반드시 변경해 주세요.\n");

        sendEmail(passwordMail);

        updatePassword(email, tempPassword);

        return tempPassword; // 임시 비밀번호 반환
    }

    // 임시 비밀번호 생성
    public String getTempPassword() {

        char[] charSet = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
        StringBuilder tempPassword = new StringBuilder();

        int idx = 0;
        for (int i = 0; i < 8; i++) {
            idx = (int) (charSet.length * Math.random());
            tempPassword.append(charSet[idx]);
        }
        return tempPassword.toString();
    }

    // 이메일 보내기
    public void sendEmail(MemberMail passwordMail) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("yourEmail");
        message.setTo(passwordMail.getToEmail());
        message.setSubject(passwordMail.getMailTitle());
        message.setText(passwordMail.getMailContent());

        mailSender.send(message);
    }

    // 임시 비밀번호 encoding 해서 update

    private void updatePassword(String email, String tempPassword) {

        String pw = passwordEncoder.encode(tempPassword);

        mapper.findByEmailAndUpdatePassword(email, pw);

    }

    public String createCode(String email) {
        MemberMail codeMail = new MemberMail();
        String tempCode = getTempCode();

        codeMail.setToEmail(email);
        codeMail.setMailTitle("인증 코드 메일입니다.");
        codeMail.setMailContent(STR."안녕하세요. 인증 코드 메일입니다.\n인증 코드는 \{tempCode} 입니다.\n");

        sendEmail(codeMail);

        return tempCode;
    }

    public String getTempCode() {

        char[] charSet = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
        StringBuilder tempCode = new StringBuilder();

        int idx = 0;
        for (int i = 0; i < 6; i++) {
            idx = (int) (charSet.length * Math.random());
            tempCode.append(charSet[idx]);
        }
        return tempCode.toString();
    }
}
