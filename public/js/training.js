document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    const trainingDate = document.getElementById('training-date').innerText // Fix to download from token NOT from site element
    fetch(`/api/get/trainings/date/${trainingDate}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const trainings = data.trainings;
        generateTrainingFields(trainings, 'main-training');
    });
});

function generateTrainingFields(trainings, containerId) {
    trainings.forEach(training => {
        // Create control flow for trainings
        const singleTrainingContainer = document.createElement('div');
        singleTrainingContainer.setAttribute('class', 'single-training');
    });
}

function toggleModal(modalSwitch) {
    if (modalSwitch) {
        document.getElementById('main-container').style.opacity = 0.5;
        document.getElementById('create-training-modal').style.display = "block";
    } else {
        document.getElementById('main-container').style.opacity = 1;
        document.getElementById('create-training-modal').style.display = "none";
    }
}