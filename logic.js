// Add status (true = up, false = down)
async function addStatus(isUp) {
    try {
        const res = await fetch('/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isUp }),
        });
        const data = await res.json();
        console.log('Inserted row:', data);

        // Update UI based on new status
        updateStatusUI(data.isUp);

        // Refresh last 10 statuses display
        getStatuses();
    } catch (err) {
        console.error('Error adding status:', err);
    }
}

// Get last 10 statuses
async function getStatuses() {
    try {
        const res = await fetch('/status');
        const rows = await res.json();
        console.log('Last statuses:', rows);

        const statusList = document.getElementById("statusList");
        if (statusList) {
            statusList.innerHTML = ""; // clear previous
            rows.forEach(row => {
                const li = document.createElement("li");
                const statusText = row.isUp ? "Working" : "Not Working";
                const time = row.lastChecked ? new Date(row.lastChecked + 'Z').toLocaleString() : 'unknown';
                li.textContent = `#${row.id}: ${statusText} at ${time}`;
                statusList.appendChild(li);
            });
        }
    } catch (err) {
        console.error('Error fetching statuses:', err);
    }
}

// Update last update text
function setLastUpdateDate(date = new Date()) {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleTimeString();
    const dateText = document.getElementById("dateText");
    if (dateText) {
        dateText.textContent = `last update: ${month} ${day}, ${time}`;
    }
}

// Update status box to "Working"
function setWorking(date = new Date()) {
    const statusBox = document.getElementById("statusBox");
    const statusText = document.getElementById("statusText");
    const statusIcon = document.getElementById("statusIcon");

    if (statusBox) {
        statusBox.classList.remove("status-red");
        statusBox.classList.add("status-green");
    }
    if (statusText) statusText.textContent = "Elevator Working";
    setLastUpdateDate(date);
    if (statusIcon) {
        statusIcon.textContent = "✔️";
        statusIcon.classList.remove("icon-red");
        statusIcon.classList.add("icon-green");
    }
}

// Update status box to "Not Working"
function setNotWorking(date = new Date()) {
    const statusBox = document.getElementById("statusBox");
    const statusText = document.getElementById("statusText");
    const statusIcon = document.getElementById("statusIcon");

    if (statusBox) {
        statusBox.classList.remove("status-green");
        statusBox.classList.add("status-red");
    }
    if (statusText) statusText.textContent = "Elevator NOT Working";
    setLastUpdateDate(date);
    if (statusIcon) {
        statusIcon.textContent = "❌";
        statusIcon.classList.remove("icon-green");
        statusIcon.classList.add("icon-red");
    }
}

// Update status box based on a boolean value
function updateStatusUI(isUp, date = new Date()) {
    if (isUp) setWorking(date);
    else setNotWorking(date);
}

// Load last status from server on page load
async function getLastStatus() {
    try {
        const res = await fetch('/status');
        const rows = await res.json();
        if (rows.length > 0) {
            const latest = rows[0];
            const date = latest.lastChecked ? new Date(latest.lastChecked + 'Z') : new Date();
            updateStatusUI(latest.isUp, date);
        } else {
            setNotWorking();
        }
    } catch (err) {
        console.error('Error fetching last status:', err);
        setNotWorking();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const workingBtn = document.getElementById("working");
    const notWorkingBtn = document.getElementById("not-working");

    if (workingBtn) workingBtn.addEventListener("click", () => addStatus(true));
    if (notWorkingBtn) notWorkingBtn.addEventListener("click", () => addStatus(false));

    // Load last 10 statuses in list
    getStatuses();

    // Set the main status box based on latest row
    getLastStatus();
});
