document.addEventListener("DOMContentLoaded", function(){
    fetch("/api/get/trainings")
    .then(response => response.json())
    .then(trainings => {
        const listTrainings = document.getElementById("trainingsList");        
        trainings.trainings.forEach(training => {
            const formattedDate = formatDate(training.date);
            
            const single_training = document.createElement("a");
            single_training.setAttribute("href", `/training.html?date=${formattedDate}`);
            single_training.innerText = training.workoutType + " - " + formattedDate

            listTrainings.appendChild(single_training);
            listTrainings.appendChild(document.createElement("br"))
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