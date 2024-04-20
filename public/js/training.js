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

    loadTrainingPanel(token);

    const form = document.getElementById('trainingForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        addTraining(token, form);
    });
});



/* SPECIFIC DATE TRAINING PANEL */
function loadTrainingPanel(token) {
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
    })
    .catch(error => {
        console.log(error.message);
    });
}

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



/* CREATE TRAINING MODAL */
function addTraining(token, form) {
    // Assigning the form data
    const formData = new FormData(form);
    const data = {}
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Fill the workoutPlan from the form data
    const groupedData = {};
    Object.keys(workoutPlanTableHeaders).forEach(headerKey => {
        const dataKeys = Object.keys(data);
        dataKeys.forEach(dataKey => {
            if (dataKey.startsWith(headerKey)) {
                const suffix = dataKey.split('-')[1]; // Suffix (number)
                if (!groupedData[suffix]) {
                    groupedData[suffix] = {};
                }
                let value = data[dataKey];
                if (headerKey === 'weightLoad' || headerKey === 'sets' || headerKey === 'repetitions') {
                    value = parseInt(value, 10);
                }
                groupedData[suffix][headerKey] = value;
            }
        });
    });

    // Extract obligatory data
    const date = document.getElementById('training-date').innerText
    const workoutType = data.workoutType;
    const workoutPlan = Object.values(groupedData);
    const extraInformation = data.extraInformation;

    // Inject data
    fetch('/api/create/training', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({date, workoutType, workoutPlan, extraInformation})
    })
    .then(response => response.json())
    .then(data => {
        // If training is created (successful)
        if (data.training) {
            console.log('Training saved successfully');
            document.getElementById('main-training').innerHTML = "";
            toggleModal(false);
            loadTrainingPanel(token);
        }
        if (data.message) {
            console.log(data.message)
        }
    })
    .catch(error => {
        console.log(error.message)
    });
}

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
                newInput = generateUserExerciseList(token, header, numberOfRows-1);
            } else {
                newInput = document.createElement('input');
                
                newInput.setAttribute('type', 'text');
                newInput.setAttribute('name', header + "-" + String(numberOfRows-1))
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

function generateUserExerciseList(token, header, rowNumber) {
    const newSelect = document.createElement('select');
    newSelect.className = "exercise-selector";
    newSelect.name = header + "-" + rowNumber;

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

function toggleModal(modalSwitch) {
    if (modalSwitch) {
        document.getElementById('main-container').style.opacity = 0.5;
        document.getElementById('create-training-modal').style.display = "block";
    } else {
        document.getElementById('main-container').style.opacity = 1;
        document.getElementById('create-training-modal').style.display = "none";
    }
}
