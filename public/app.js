function validateLogin(e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Check for null values
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    $.get('/validateLogin', { username: username, password: password })
        .done((response) => {
            if (response.success) {
                localStorage.clear();
                alert('Login successful!\nUsername: ' + username);
                localStorage.setItem(`username`, username);
                // Rediredirect to content page
                window.location.href = "content.html";
            } else {
                alert('Login failed. Please enter valid credentials.');
                localStorage.clear();
            }
        })
        .fail(() => {
            alert('Error occurred while processing login.');
        });
}

function createUser(e) {
    e.preventDefault();
    localStorage.clear();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    if (!username || !password || !email || !password2) {
        alert('All fields must be filled out');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    const userData = {
        email: email,
        username: username,
        password: password
    };
    $.ajax({
        url: '/create',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function(response) {
            console.log('Server response:', response);
            alert('User created successfully, please wait to be redirected');
            navigateToLogin()
        },
        error: function(error) {
            console.error('Error from post:', error);
            alert('Error creating user. Please try again.');
        }
    });
}

function navigateToLogin() {
    localStorage.clear();
    window.location.href = "login.html";
}
function navigateToCreate() {
    localStorage.clear();
    window.location.href = "create.html";
}