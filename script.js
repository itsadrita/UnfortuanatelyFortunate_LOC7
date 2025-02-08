import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuQJVZZ0w65mrl2A-swnrcD8JUz7XrmHc",
    authDomain: "loc70-eaf4d.firebaseapp.com",
    projectId: "loc70-eaf4d",
    storageBucket: "loc70-eaf4d.appspot.com",
    messagingSenderId: "962983024035",
    appId: "1:962983024035:web:18689d6ca85b05c8a13616",
    measurementId: "G-5Y73CMW04G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display cases
async function fetchCases() {
    const casesGrid = document.querySelector(".cases-grid");
    if (!casesGrid) {
        console.error("No element with class 'cases-grid' found.");
        return;
    }
    casesGrid.innerHTML = "";  // Clear existing cases

    try {
        const querySnapshot = await getDocs(collection(db, "cases"));
        if (querySnapshot.empty) {
            console.log("No cases found.");
            casesGrid.innerHTML = '<p>No cases available.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const caseData = doc.data();
            console.log("Fetched case:", doc.id, caseData);

            const caseElement = document.createElement("div");
            caseElement.classList.add("case-card");
            caseElement.innerHTML = `
                <h3>${caseData.title}</h3>
                <p>${caseData.description}</p>
                <p><strong>Priority:</strong> ${caseData.priority}</p>
                <p><strong>Status:</strong> ${caseData.status}</p>
            `;
            casesGrid.appendChild(caseElement);
        });
    } catch (e) {
        console.error("Error fetching cases: ", e);
        alert("Error fetching cases: " + e.message);
    }
}

// Fetch cases on DOM load
document.addEventListener("DOMContentLoaded", fetchCases);

// Theme Toggle
document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Cases Chart
const casesCtx = document.getElementById('casesChart').getContext('2d');
new Chart(casesCtx, {
    type: 'doughnut',
    data: {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [{
            data: [30, 45, 25],
            backgroundColor: [
                '#4f46e5', // Accent color
                '#60a5fa', // Blue
                '#475569'  // Gray
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#e2e8f0' // Light text color
                }
            }
        }
    }
});

// Progress Chart
const progressCtx = document.getElementById('progressChart').getContext('2d');
new Chart(progressCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Cases Solved',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: '#4f46e5',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0' // Light text color
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#2d2f31' // Dark grid lines
                },
                ticks: {
                    color: '#e2e8f0' // Light text color
                }
            },
            x: {
                grid: {
                    color: '#2d2f31' // Dark grid lines
                },
                ticks: {
                    color: '#e2e8f0' // Light text color
                }
            }
        }
    }
});

// Simulate real-time updates
setInterval(() => {
    const alerts = document.querySelector('.alert-list');
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item';
    newAlert.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <div class="alert-content">
            <p>System Update: New case added</p>
            <span>Just now</span>
        </div>
    `;
    alerts.insertBefore(newAlert, alerts.firstChild);
    if (alerts.children.length > 5) {
        alerts.removeChild(alerts.lastChild);
    }
}, 30000);