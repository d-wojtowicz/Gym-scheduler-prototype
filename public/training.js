document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const trainingDate = urlParams.get("date");

    fetch(`/api/get/trainings/date/${trainingDate}`)
    .then(response => response.json())
    .then(data => {
        // Create 'date of training'
        document.getElementById("trainingDate").innerText = formatDate(data.trainings[0].date);

        const listTrainingsPerDay = document.getElementById("trainingsListPerDay");
        data.trainings.forEach(training => {
            // Create 'main div' for all gathered info
            const trainingBlock = document.createElement("div");
            trainingBlock.setAttribute("id", training._id);

            // Create 'workout type header' inside 'main div'
            const workoutType = document.createElement("h2");
            workoutType.innerText = training.workoutType;
            trainingBlock.appendChild(workoutType);
            
            // Create 'workout plan table' inside 'main div'
            const workoutPlan = formatTable(training.workoutPlan);
            trainingBlock.appendChild(workoutPlan);

            // Append generated elements
            trainingBlock.appendChild(document.createElement("br"));
            listTrainingsPerDay.appendChild(trainingBlock);
        });
    });
});



function formatDate(date){
    const d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

function formatTable(workoutPlan){
    // Init 'main table' and 'header row'
    const singleTrainingTable = document.createElement("table");
    singleTrainingTable.setAttribute("class", "trainingTable")
    const headerRow = document.createElement("tr");
    const headers = ["Exercise", "Weight load", "Sets", "Repetitions", "Notes"];

    // Fill the 'header row' for 'main table'
    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.innerText = headerText;
        headerRow.appendChild(header);
    });
    singleTrainingTable.appendChild(headerRow);

    workoutPlan.forEach(exercise => {
        const row = document.createElement("tr");

        // Create cells for 'single exercise row'
        const typeCell = document.createElement("td");
        const weightLoadCell = document.createElement("td");
        const sets = document.createElement("td");
        const repetitions = document.createElement("td");
        const notes = document.createElement("td");

        // Fill in generated cells
        typeCell.innerText = exercise.type;
        weightLoadCell.innerText = exercise.weight_load;
        sets.innerText = exercise.sets;
        repetitions.innerText = exercise.repetitions;
        notes.innerText = exercise.notes || "-";
        
        // Merge prepared cells into single 'exercise row'
        row.appendChild(typeCell);
        row.appendChild(weightLoadCell);
        row.appendChild(sets);
        row.appendChild(repetitions);
        row.appendChild(notes);

        singleTrainingTable.appendChild(row);
    });

    return singleTrainingTable;
}