// This will check the login status every time the user tries to access index.html
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
};
