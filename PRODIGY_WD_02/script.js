let startTime = 0,
	elapsedTime = 0,
	tInterval;
let running = false;
let laps = [];

// Function to start or stop the stopwatch
function toggleStartStop() {
	const startStopBtn = document.getElementById("startStopBtn");
	const lapBtn = document.getElementById("lapBtn");
	const resetBtn = document.getElementById("resetBtn");
	const clearLapsBtn = document.getElementById("clearLapsBtn");

	if (running) {
		// Pausing the stopwatch
		clearInterval(tInterval);
		elapsedTime += Date.now() - startTime;
		startStopBtn.textContent = "Resume";
		lapBtn.disabled = true;
	} else {
		// Resuming the stopwatch
		startTime = Date.now();
		tInterval = setInterval(updateDisplay, 10);
		startStopBtn.textContent = "Pause";
		lapBtn.disabled = false;
		resetBtn.disabled = false;
		clearLapsBtn.disabled = false;
	}
	running = !running;
}

// Function to reset the stopwatch
function reset() {
	clearInterval(tInterval);
	elapsedTime = 0;
	running = false;
	laps = [];
	document.getElementById("display").textContent = "00:00:00.000";
	document.getElementById("startStopBtn").textContent = "Start";
	document.getElementById("lapBtn").disabled = true;
	document.getElementById("resetBtn").disabled = true;
	document.getElementById("clearLapsBtn").disabled = true;
	document.getElementById("lapsList").innerHTML = "";
	localStorage.removeItem("stopwatchState");
}

// Function to update the stopwatch display
function updateDisplay() {
	const currentTime = Date.now() - startTime + elapsedTime;
	const hours = Math.floor(currentTime / (1000 * 60 * 60));
	const minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
	const milliseconds = Math.floor((currentTime % 1000) / 10);

	document.getElementById("display").textContent = `${padZero(hours)}:${padZero(
		minutes
	)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;

	saveState();
}

// Function to record a lap time
function recordLap() {
	if (running) {
		const lapTime = document.getElementById("display").textContent;
		laps.push(lapTime);
		const lapRow = document.createElement("tr");
		lapRow.innerHTML = `<td>${
			laps.length
		}</td><td>${lapTime}</td><td><button class="delete-btn" onclick="deleteLap(${
			laps.length - 1
		})">Delete</button></td>`;
		document.getElementById("lapsList").appendChild(lapRow);
		saveState();
	}
}

// Function to delete a specific lap time
function deleteLap(index) {
	laps.splice(index, 1);
	updateLapList();
}

// Function to clear all lap times
function clearLaps() {
	laps = [];
	updateLapList();
	document.getElementById("clearLapsBtn").disabled = true;
}

// Function to update the lap times list
function updateLapList() {
	const lapsList = document.getElementById("lapsList");
	lapsList.innerHTML = "";
	laps.forEach((lapTime, index) => {
		const lapRow = document.createElement("tr");
		lapRow.innerHTML = `<td>${
			index + 1
		}</td><td>${lapTime}</td><td><button class="delete-btn" onclick="deleteLap(${index})">Delete</button></td>`;
		lapsList.appendChild(lapRow);
	});
	saveState();
}

// Function to save the current state to local storage
function saveState() {
	const state = {
		elapsedTime,
		running,
		laps,
	};
	localStorage.setItem("stopwatchState", JSON.stringify(state));
}

// Function to load the saved state from local storage
function loadState() {
	const state = JSON.parse(localStorage.getItem("stopwatchState"));
	if (state) {
		elapsedTime = state.elapsedTime;
		laps = state.laps || [];
		updateLapList();
		if (state.running) {
			toggleStartStop();
		} else {
			updateDisplay();
		}
	}
}

// Helper function to pad numbers with leading zeros
function padZero(num, size = 2) {
	let s = num.toString();
	while (s.length < size) s = "0" + s;
	return s;
}

// Event listeners for the buttons
document
	.getElementById("startStopBtn")
	.addEventListener("click", toggleStartStop);
document.getElementById("lapBtn").addEventListener("click", recordLap);
document.getElementById("resetBtn").addEventListener("click", reset);
document.getElementById("clearLapsBtn").addEventListener("click", clearLaps);

// Load the state when the page is loaded
window.onload = loadState;
