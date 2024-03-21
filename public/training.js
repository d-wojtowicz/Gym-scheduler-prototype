document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const trainingDate = urlParams.get("date");

    fetch(`/api/get/trainings/date/${trainingDate}`)
    .then(response => response.json())
    .then(trainings => {
        document.getElementById("trainingDate").innerText = formatDate(trainings.trainings[0].date);

        const listTrainingsPerDay = document.getElementById("trainingsListPerDay");
        trainings.trainings.forEach(training => {
            const trainingBlock = document.createElement("div");
            trainingBlock.setAttribute("id", training._id);

            const workoutType = document.createElement("h2");
            const workoutPlan = document.createElement("p");
            workoutType.innerText = training.workoutType;
            workoutPlan.innerText = training.workoutPlan;

            trainingBlock.appendChild(workoutType);
            trainingBlock.appendChild(workoutPlan);
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