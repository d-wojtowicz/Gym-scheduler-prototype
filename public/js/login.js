// Token reset
if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    localStorage.removeItem('actualPageDate');
}

// If redirected from 'register' panel by created account
if (localStorage.getItem('registerSuccess')) {
    localStorage.removeItem('registerSuccess');
    const success_msg = document.createElement("p");
    success_msg.innerText = "The account has been created";
    success_msg.setAttribute('style', 'color: green');
    document.getElementById('loginResponse').replaceChildren(success_msg);
}

document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    // Fetch filled 'username' and 'password' from 'Login form'
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Try to generate 'token' and log in to the 'dashboard'
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
    })
    .then(response => response.json())
    .then(data => {
        // If token is generated (successful)
        if (data.token) {
            // Try to open the training panel ('dashboard')
            localStorage.setItem('token', data.token);
            fetch('/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            })
            .then(response => {
                if (response.ok){
                    // This does not look correct, take a look at it later
                    window.location.href = "/dashboard"; 
                }
            })
        }
        // If token is NOT generated (unsuccessful)
        if (data.message) {
            const error_msg = document.createElement("p");
            error_msg.innerText = data.message;
            document.getElementById('loginResponse').replaceChildren(error_msg);
        }
    });
});