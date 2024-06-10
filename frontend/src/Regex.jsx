// 이메일 정규표현식
export const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// 비밀번호 정규표현식
export const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/;

// 핸드폰번호 정규표현식
export const phoneNumberPattern =
  /^(01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
