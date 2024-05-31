document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    loadUserPanel(token);
    loadPrivateExercises(token);
    loadMeasurements(token);
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
        if (privateList.privateExercise) {
            privateList.privateExercise.customExercises.forEach(singlePrivateExercise => {
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

function delPrivateExercise() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const privateExerciseName = document.getElementById('privateExerciseName').value;
    if (privateExerciseName) {
        const customExerciseNames = privateExerciseName;
        fetch('/api/delete/privateExercise', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ customExerciseNames })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadPrivateExercises(token);
        })
        .catch(error => {
            console.log(error.message);
        });
    }
}

function loadMeasurements(token) {
    fetch('/api/get/measurements', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("LOADING MEASUREMENTS: ", data)
    })
    .catch(error => {
        console.log("A measurements list was not detected:\n", error)
    });
}

function addMeasurement() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const date = document.getElementById('measurement-date').value;
    const weight = document.getElementById('weight').value;
    const chest = document.getElementById('chest').value;
    const waist = document.getElementById('waist').value;
    const stomach = document.getElementById('stomach').value;
    const muffin_top = document.getElementById('muffin-top').value;
    const biceps_l = document.getElementById('biceps-L').value;
    const biceps_r = document.getElementById('biceps-R').value;
    const thigh = document.getElementById('thigh').value;
    const calf = document.getElementById('calf').value;
    if (date) { 
        const measurements = [{
            "date": date, 
            "weight": weight, 
            "chest": chest, 
            "waist": waist, 
            "stomach": stomach, 
            "muffin_top": muffin_top, 
            "biceps_l": biceps_l, 
            "biceps_r": biceps_r, 
            "thigh": thigh, 
            "calf": calf
        }];

        fetch('/api/patch/measurement', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ measurements })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            loadMeasurements(token);
        })
        .catch(error => {
            console.log(error.message);
        });
    }
}