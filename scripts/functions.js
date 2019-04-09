// open and close functions
const open = (item) => item.style.display = 'flex';
const close = (item) => item.style.display = 'none';

const loginLink = document.querySelector('#loginLink')
const signUpLink = document.querySelector('#signUpLink')
const loginForm = document.querySelector('.login')
const signUpForm = document.querySelector('.signup')

// opening-closing login & signup form
const openLogin = (e) => {
    e.preventDefault();
    open(loginForm);
    close(signUpForm);
}

const openSignup = (e) => {
    e.preventDefault();
    open(signUpForm);
    close(loginForm);
}
loginLink.addEventListener('click', openLogin);
signUpLink.addEventListener('click', openSignup);
document.querySelector('#loginX').addEventListener('click', function(){close(loginForm)
});
document.querySelector('#signupX').addEventListener('click', function(){close(signUpForm)
});



