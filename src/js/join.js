'use strict'

function onButtonJoin() {
    const inputs  = document.querySelectorAll('.joinRow > input');
    const pw      = document.querySelector('#pw');
    const pwCheck = document.querySelector('#pwCheck');    
    const id      = document.querySelector('#id');
    const name    = document.querySelector('#name');
    
    //input에서 하나라도 빈 문자인지 체크
    inputs.forEach(input => {
        if(input.value === '' || input.value === 'undefined') {
            alert('모두 입력해주세요');
            return;
        }
    })   

    //중복 아이디 체크
    checkID()
     .then(data => {
         data.forEach(userID => {
             if(userID.userid === id.value) {
                 alert('중복 아이디입니다.');
                 return ;
             }
         });
     });
    
    //pw check
    if(pw.value !== pwCheck.value) {
        alert('비밀번호를 다시 입력해주세요');
        return;
    }

    //email Check
    const email      = document.querySelector('#email');    
    const emailCheck = checkEmail(email.value);

    if(!emailCheck) {
        alert('email을 다시 입력해주세요');
        return;
    }
    
    saveUser(id.value, pw.value, name.value, email.value);
}

function saveUser(id, pw, name, email) {    
    fetch('http://127.0.0.1:5000/users', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userid: id,
            pw: pw,
            name: name,
            email: email
        })
    }).then(res => {
        if(res.ok) {
            alert('생성이 완료 되었습니다.');
            location.href = 'http://127.0.0.1:5500/src/html/login.html?';
        }
    })        
}

async function checkID() {
    const res  = await fetch('http://127.0.0.1:5000/users');
    const data = await res.json();

    return data;
}

function checkEmail(str) {   
    let reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if(!reg_email.test(str)) { return false; }    
    else { return true; }     
}   


