import axios from 'axios';
import 'bootstrap';
import * as $ from 'jquery';
import * as Toastr from 'toastr';

function Auth() {}

Auth.prototype.signIn = function() {
    const loginURL = 'http://patriotpangan.com/nodejs/auth/loginadmin';
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');
    const emailValue = emailElement.value;
    const passwordValue = passwordElement.value;
    const authElement = document.querySelector('.alert-auth');

    axios.post(loginURL, {
        email: emailValue,
        password: passwordValue,
    }).then(res => {
        if (res.status === 200 && res.data.status) {
            const token = JSON.stringify({token: res.data.token});
            localStorage.setItem('patriotpangan', token);
            authElement.style.display = 'none';
            $('#authModal').modal('hide');
            Toastr.success('Sukses login');
            location.reload();
        } else {
            authElement.style.display = 'block';
        }
    }).catch(err => {
        alert('Internal Server Error');
        throw err;
    })
}

Auth.prototype.signOut = function() {
    localStorage.removeItem('patriotpangan');
}

export { Auth }