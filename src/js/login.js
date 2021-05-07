'use strict'

function onLoginClick() {
    const id = document.querySelector('#loginID');
    const pw = document.querySelector('#loginPW');

    getUser(id.value, pw.value)
        .then(user => {
            if(user.length > 0) {
                alert('로그인 성공!!');
                sessionStorage.setItem('user',JSON.stringify(user))
                location.href = 'http://127.0.0.1:5500/src/html/index.html?';
            } else {
                alert('로그인 실패!!');
                id.value = '';
                pw.value = '';
            }
        })
}

async function getUser(id, pw) {
    const res = await fetch('http://127.0.0.1:5000/users');
    const data = await res.json();
    const user = data
        .filter(users => users.userid === id)
        .filter(users => users.pw === pw);

    return user;
}