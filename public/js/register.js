// Token reset
if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
}

document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    // Fetch filled 'username', 'password' and 'password_rep' from 'Register form'
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password_rep = document.getElementById('password_rep').value;

    // Try to register the user in the mongodb database
    fetch('/api/create/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password, password_rep})
    })
    .then(response => response.json())
    .then(data => {
        // If user is created (successful)
        if (data.user) {
            // Try to open the login panel ('login')
            fetch('/login', {
                method: 'GET'
            })
            .then(response => {
                if (response.ok){
                    // This does not look correct, take a look at it later
                    localStorage.setItem('registerSuccess', 'The account has been created');
                    window.location.href = "/login"; 
                }
            })
        }
        // If user is NOT created (unsuccessful)
        if (data.message) {
            const error_msg = document.createElement("p");
            error_msg.innerText = data.message;
            document.getElementById('registerResponse').replaceChildren(error_msg);
        }
    });
});