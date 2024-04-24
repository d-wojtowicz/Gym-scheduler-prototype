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

    const createForm = document.getElementById('createTrainingForm');
    createForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTraining(token, createForm);
    });

    const editForm = document.getElementById('editTrainingForm');
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        editTraining(token, editForm);
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

function generateButtons(training) {
    const buttonsHeader = document.createElement('div');

    const removeTrainingButton = document.createElement('button');
    removeTrainingButton.setAttribute('class', 'button');
    removeTrainingButton.setAttribute('onClick', `removeTraining('${training._id}')`);
    removeTrainingButton.innerText = "REMOVE";
    buttonsHeader.appendChild(removeTrainingButton);

    const editTrainingButton = document.createElement('button');
    editTrainingButton.setAttribute('class', 'button');
    editTrainingButton.setAttribute('onClick', `toggleEditTrainingModal(true, '${training._id}')`);
    editTrainingButton.innerText = "EDIT";
    buttonsHeader.appendChild(editTrainingButton);

    return buttonsHeader;
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

        // Generate 'remove & edit training' buttons
        const trainingButtons = generateButtons(training);

        //singleTrainingContainer.appendChild(singleTrainingTitle);
        singleTrainingContainer.appendChild(singleTrainingPlan);
        document.getElementById(containerId).appendChild(trainingButtons);
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
            toggleCreateTrainingModal(false);
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

function removeTraining(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    fetch(`/api/delete/training/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('main-training').innerHTML = "";
        loadTrainingPanel(token);
    })
    .catch(error => {
        console.log(`The training could not be removed: ${error}`);
    });
}

function addExercise(planId) {    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const workoutPlanTable = document.getElementById(planId);
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

function removeExercise(planId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const workoutPlanTable = document.getElementById(planId);
    const numberOfRows = workoutPlanTable.getElementsByTagName('tr').length;
    const MIN_EXERCISE_NUMBER = 1;

    if (numberOfRows > MIN_EXERCISE_NUMBER) {
        workoutPlanTable.removeChild(workoutPlanTable.lastChild)
    }
}

function generateUserExerciseList(token, header, rowNumber, value) {
    let newSelect = document.createElement('select');
    newSelect.className = "exercise-selector";
    if (value) {
        newSelect.name = header + "Edit-" + rowNumber;  
        newSelect.setAttribute('id', header + "Edit-" + rowNumber)
    } else {
        newSelect.name = header + "-" + rowNumber;
        newSelect.setAttribute('id', header + "-" + rowNumber)
    }

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
            if (newOption.value === value) {
                newOption.selected = true;
                newSelect.insertBefore(newOption, newSelect.firstChild);
            } else {
                newSelect.appendChild(newOption);
            }
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
            if (newOption.value === value) {
                newOption.selected = true;
                newSelect.insertBefore(newOption, newSelect.firstChild);
            } else {
                newSelect.appendChild(newOption);
            }
        });
    })
    .catch(error => {
        console.log("A global exercise list was not detected:\n", error)
    });

    return newSelect;
}

function toggleCreateTrainingModal(modalSwitch) {
    if (modalSwitch) {
        document.getElementById('main-container').style.opacity = 0.5;
        document.getElementById('create-training-modal').style.display = "block";
    } else {
        document.getElementById('main-container').style.opacity = 1;
        document.getElementById('create-training-modal').style.display = "none";
    }
}



/* EDIT TRAINING MODAL */
function toggleEditTrainingModal(modalSwitch, trainingId) {
    if (trainingId) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        fetch(`/api/get/trainings/id/${trainingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            const trainingInfo = data.training[0];
            const workoutType = trainingInfo.workoutType;
            const workoutPlan = trainingInfo.workoutPlan;
            const extraInformation = trainingInfo.extraInformation;
            fillEditTrainingModal(trainingId, workoutType, workoutPlan, extraInformation);
        });
    }
    if (modalSwitch) {
        document.getElementById('main-container').style.opacity = 0.5;
        document.getElementById('edit-training-modal').style.display = "block";
    } else {
        document.getElementById('main-container').style.opacity = 1;
        document.getElementById('edit-training-modal').style.display = "none";
    }
}

function fillEditTrainingModal(trainingId, workoutType, workoutPlan, extraInformation) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    document.getElementById('workoutTypeEdit').value = workoutType;
    document.getElementById('extraInformationEdit').value = extraInformation;

    const workoutPlanTable = document.getElementById('workoutPlanEdit');
    resetWorkoutPlanTableState(workoutPlanTable);
    const containerId = workoutPlanTable.getElementsByTagName('tbody')[0]
    containerId.setAttribute('id', trainingId)

    let numberOfRows = workoutPlanTable.getElementsByTagName('tr').length;
    if (numberOfRows == 1) {
        workoutPlan.forEach(singleExerciseRow => {
            const newRow = document.createElement('tr');
            Object.keys(workoutPlanTableHeaders).forEach(header => {
                const newCell = document.createElement('td');
                let newInput = "";

                if (header == "name") {
                    newInput = generateUserExerciseList(token, header, numberOfRows-1, singleExerciseRow[header]);
                } else {
                    newInput = document.createElement('input');

                    newInput.setAttribute('type', 'text');
                    newInput.setAttribute('name', header + "Edit-" + String(numberOfRows-1));
                    newInput.setAttribute('required', true);
                    newInput.setAttribute('value', singleExerciseRow[header]);
                    newInput.setAttribute('id', workoutPlanTableHeaders[header] + "Edit_" + String(numberOfRows));
                    newInput.setAttribute('list', 'exercises-list');
                }
                newCell.appendChild(newInput);
                newRow.appendChild(newCell);
            });
            workoutPlanTable.appendChild(newRow);
            numberOfRows = workoutPlanTable.getElementsByTagName('tr').length;
        });       
    }
}

function resetWorkoutPlanTableState(workoutPlanTable) {
    const rowsToReset = Array.from(workoutPlanTable.children).filter(child => child.tagName === 'TR');
    rowsToReset.forEach(tr => workoutPlanTable.removeChild(tr));
}

function editTraining() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    // Assigning the form data
    const editForm = document.getElementById('editTrainingForm');
    const formData = new FormData(editForm);
    const data = {}
    formData.forEach((value, key) => {
        data[key.replace('Edit','')] = value;
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
    const workoutPlanEdit = document.getElementById('workoutPlanEdit');
    const containerId = workoutPlanEdit.getElementsByTagName('tbody')[0];
    
    const id = containerId.getAttribute('id');
    const date = document.getElementById('training-date').innerText;
    const workoutType = data.workoutType;
    const workoutPlan = Object.values(groupedData);
    const extraInformation = data.extraInformation;

    // Inject data
    fetch(`/api/update/training/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({date, workoutType, workoutPlan, extraInformation})
    })
    .then(response => response.json())
    .then(data => {
        // If training is updated (successful)
        if (data.training) {
            console.log('Training update saved successfully');
            document.getElementById('main-training').innerHTML = "";
            toggleEditTrainingModal(false);
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