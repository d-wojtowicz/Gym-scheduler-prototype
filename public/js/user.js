document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    loadUserPanel(token);
    loadPrivateExercises(token);
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

function loadPrivateExercises(token) {
    const parent = document.getElementById('privateExercises');
    parent.innerHTML = "";

    let newSelect = document.createElement('select');
    newSelect.className = "exercise-selector";

    // Add private exercises list
    fetch('/api/get/privateExercise', {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(privateList => {
        console.log(privateList)
        if (privateList.privateExercise) {
            privateList.privateExercise.customExercises.forEach(singlePrivateExercise => {
                console.log(singlePrivateExercise);
                const newOption = document.createElement('option');
                newOption.value = singlePrivateExercise.name;
                newOption.innerText = singlePrivateExercise.name;
                newSelect.appendChild(newOption);
            });
            parent.appendChild(newSelect);
        }
    })
    .catch(error => {
        console.log("A private exercise list was not detected:\n", error)
    });
}

function addPrivateExercise() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const privateExerciseName = document.getElementById('privateExerciseName').value;
    if (privateExerciseName) {
        const customExercises = [{"name": privateExerciseName}];
        fetch('/api/patch/privateExercise', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customExercises })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadPrivateExercises(token);
        })
        .catch(error => {
            console.log(error.message)
        });
    }
}