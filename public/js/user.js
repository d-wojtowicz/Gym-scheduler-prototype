document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    loadUserPanel(token);
});

function loadUserPanel(token) {
    fetch('/api/get/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            const user = data.user;

            const age = user.age ?? '-';
            const weight = user.weight ?? '-';
            const height = user.height ?? '-';

            document.getElementById('userAge').innerText = age;
            document.getElementById('userWeight').innerText = weight;
            document.getElementById('userHeight').innerText = height;
        } else {
            console.log("Error occurred: ", data.message);
        }
    });
}