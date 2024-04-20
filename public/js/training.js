const workoutPlanTableHeaders = {
    'name': "Name", 
    'weightLoad': "Weight load", 
    'sets': "Sets", 
    'repetitions': "Repetitions"
};
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
        const singleTrainingContainer = document.createElement('div');
        singleTrainingContainer.setAttribute('class', 'single-training');
        
        // Workout type of single training
        //const singleTrainingTitle = document.createElement('h2');
        //singleTrainingTitle.innerText = training.workoutType;

        // Create the structure of single training table
        const singleTrainingPlan = document.createElement('table');
        const singleTrainingHeaders = document.createElement('tr');
        Object.values(workoutPlanTableHeaders).forEach(header => {
            const singleWorkoutPlanTableHeader = document.createElement('th');
            singleWorkoutPlanTableHeader.innerText = header;
            singleTrainingHeaders.appendChild(singleWorkoutPlanTableHeader);
        });
        singleTrainingPlan.appendChild(singleTrainingHeaders);


        // Fill the structure of single training table - Workout plan
        training.workoutPlan.forEach(exercise => {
            const singleExerciseRow = document.createElement('tr');
            Object.keys(workoutPlanTableHeaders).forEach(header => {
                const singleExerciseCell = document.createElement('td');
                singleExerciseCell.innerText = exercise[header];
                singleExerciseRow.appendChild(singleExerciseCell);
            });
            singleTrainingPlan.appendChild(singleExerciseRow);
        });

        //singleTrainingContainer.appendChild(singleTrainingTitle);
        singleTrainingContainer.appendChild(singleTrainingPlan);
        document.getElementById(containerId).appendChild(singleTrainingContainer);
        document.getElementById(containerId).appendChild(document.createElement('br'));
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
/* 
function addTraining() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const workoutPlanTable = document.getElementById('workoutPlan');
    const numberOfRows = workoutPlanTable.getElementsByTagName('tr').length;

    if (workoutPlanTable) {
        const rows = workoutPlanTable.rows;

        console.log(workoutPlanTable.getElementsByTagName('tr')[1].children)
    }

    toggleModal(false);
} */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainingForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {}
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log(data, "CCC")
    })
});
/* PRZEROBIC ADDTRAINING WYZEJ NA LISTENERA KTORY WEZMIE Z FORMULARZA DANE, PRZENIESC SUBMIT DO FORMA */

function addExercise() {    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const workoutPlanTable = document.getElementById('workoutPlan');
    const numberOfRows = workoutPlanTable.getElementsByTagName('tr').length;
    const MAX_EXERCISE_NUMBER = 8;

    if (numberOfRows <= MAX_EXERCISE_NUMBER) {
        const newRow = document.createElement('tr');

        Object.keys(workoutPlanTableHeaders).forEach(header => {
            const newCell = document.createElement('td');
            let newInput = "";

            if (header == "name") {
                newInput = generateUserExerciseList(token);
            } else {
                newInput = document.createElement('input');
                
                newInput.setAttribute('type', 'text');
                newInput.setAttribute('required', true);
                newInput.setAttribute('id', workoutPlanTableHeaders[header] + "_" + String(numberOfRows));
                newInput.setAttribute('list', 'exercises-list');
            }
            newCell.appendChild(newInput);
            newRow.appendChild(newCell);
        });

        workoutPlanTable.appendChild(newRow);
    } else {
        // TODO: Add modal informing about exceeding the MAX EXERCISE NUMBER
    }
}

function generateUserExerciseList(token) {
    const newSelect = document.createElement('select');
    newSelect.className = "exercise-selector"

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
        privateList.privateExercise.forEach(singlePrivateExercise => {
            const newOption = document.createElement('option');
            newOption.value = singlePrivateExercise.name;
            newOption.innerText = singlePrivateExercise.name;
            newSelect.appendChild(newOption);
        });
    })
    .catch(error => {
        console.log("A private exercise list was not detected:\n", error)
    });

    // Add global exercises list
    fetch('/api/get/globalExercise', {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(globalList => {
        globalList.globalExercise.forEach(singleGlobalExercise => {
            const newOption = document.createElement('option');
            newOption.value = singleGlobalExercise.name;
            newOption.innerText = singleGlobalExercise.name;
            newSelect.appendChild(newOption);
        });
    })
    .catch(error => {
        console.log("A global exercise list was not detected:\n", error)
    });

    return newSelect;
}