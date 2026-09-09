class Auth {
    constructor() {
        this.init();
    }

    async init() {
        this.checkLoginStatus();
        this.bindLoginForm();
    }

    checkLoginStatus() {
        const token = localStorage.getItem("loginToken");
        if (token) {
            window.location.href = '/';
        }
        return false;
    }

    bindLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendLoginRequest();
            });
        }
    }

    sendLoginRequest() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.token) {
                    this.loginUser(data.token);
                } else {
                    alert(data.message || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error sending login request:', error);
                alert('An error occurred during login. Please try again.');
            });
    }

    loginUser(token) {
        localStorage.clear();
        localStorage.setItem("loginToken", token);
        window.location.href = '/';
    }

    logout() {
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});
