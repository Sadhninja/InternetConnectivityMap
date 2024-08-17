function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Check if the credentials are correct
    if (username === 'user' && password === 'password') {
        // Store login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');

        // Redirect to index.html
        window.location.href = 'index.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
}
