function setLastUpdateDate(){
    const now = new Date();

    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    const time = now.toLocaleTimeString();


    const dateText = document.getElementById("dateText");
    if (dateText) {
        dateText.textContent = `last update: ${month} ${day}, ${time}`;
    }
}

const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");
const statusIcon = document.getElementById("statusIcon");

function setWorking() {
    statusBox.classList.remove("status-red");
    statusBox.classList.add("status-green");
    statusText.textContent = "Elevator Working";
    setLastUpdateDate();
    if (statusIcon) {
        statusIcon.textContent = "✔️";
        statusIcon.classList.remove("icon-red");
        statusIcon.classList.add("icon-green");
    }
}

function setNotWorking() {
    statusBox.classList.remove("status-green");
    statusBox.classList.add("status-red");
    statusText.textContent = "Elevator NOT Working";
    setLastUpdateDate();
    if (statusIcon) {
        statusIcon.textContent = "❌";
        statusIcon.classList.remove("icon-green");
        statusIcon.classList.add("icon-red");
    }
}