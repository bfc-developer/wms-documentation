class Auth {
    constructor() {
        this.init();
    }

    async init() {
        this.checkLoginStatus();
        this.bindLoginForm();
    }

    checkLoginStatus()
    {
        const token = localStorage.getItem("loginToken");
        if(token)
        {
            window.location.href = '/';
        }
        return false;
    }
    bindLoginForm()
    {
        // logout button
        document.getElementById('logout').addEventListener('click', () => {
            this.logout();
        });

        const tfaState = localStorage.getItem("TFAstate");
        if(!tfaState)
        {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('TFA-form').style.display = 'none';
        }
        else
        {
            this.showTFAScreen()
        }
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendLoginRequest();
        });
        document.getElementById('TFA-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyTFAcode();
        });
    }
    sendLoginRequest(){
        const email = document.getElementById('email').value;
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
            if (data.success) {
                if(data?.TFA_url != undefined || data?.TFA_url != null)
                {
                    localStorage.setItem("TFAurl", data?.TFA_url);
                }
                localStorage.setItem("TFAstate", true);
                localStorage.setItem("email", email);
                this.showTFAScreen();
            } else {
                // Login failed, show error message
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error sending login request:', error);
        }); 
    }

    showTFAScreen()
    {
        this.showTFAqr();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('TFA-form').style.display = 'block';
    }

    showTFAqr()
    {
        const url = localStorage.getItem("TFAurl");
        const qror = document.getElementById('qror');
        if(url)
        {
            qror.style.display = 'block';
            const qrCodeContainer = document.getElementById('qrcode');
            qrCodeContainer.innerHTML = '';
            const qrcode = new QRCode(qrCodeContainer, {
                text: url,
                width: 128,
                height: 128,
                colorDark : '#000',
                colorLight : '#fff',
                correctLevel : QRCode.CorrectLevel.H
                });
        }
        else
        {
            qror.style.display = 'none';
        }
    }

    verifyTFAcode()
    {
        const code = document.getElementById('TFAcode').value;
        const email = localStorage.getItem("email");
        fetch('/verify-tfa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if(!data?.token)
                {
                    alert("Unable to login");
                    return;
                }
                this.loginUser(data?.token);
            } else {
                // Login failed, show error message
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error sending login request:', error);
        });
    }

    loginUser(token)
    {
        localStorage.clear();
        localStorage.setItem("loginToken", token);
        window.location.href = '/';
    }

    logout()
    {
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});