import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const casesRef = collection(db, "cases"); // Adjust if needed
// Add the modal HTML to the page
document.body.insertAdjacentHTML('beforeend', `
    <div id="createCaseModal" class="modal" style="display: none;">
        <div class="modal-content">
            <h2>Create New Case</h2>
            <form id="createCaseForm">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="caseTitle" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="caseDescription" required></textarea>
                </div>
                <div class="form-group">
                    <label>Department</label>
                    <select id="caseDepartment" required>
                        <option value="Criminal Investigation">Criminal Investigation</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Narcotics">Narcotics</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="casePriority" required>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="caseStatus" required>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Create Case</button>
                </div>
            </form>
        </div>
    </div>
`);

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
                <p><strong>Created At:</strong> ${new Date(caseData.createdAt.seconds * 1000).toLocaleString()}</p>
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
function generateCaseNumber() {
    const timestamp = Date.now();
    return `CASE-${timestamp}`;
}
// Function to add a new case
window.addNewCase = async function() {
    const caseTitle = document.getElementById('caseTitle').value;
    const caseDescription = document.getElementById('caseDescription').value;
    const casePriority = document.getElementById('casePriority').value;
    const caseStatus = document.getElementById('caseStatus').value;

    try {
        const docRef = await addDoc(collection(db, "cases"), {
            title: caseTitle,
            description: caseDescription,
            priority: casePriority,
            status: caseStatus,
            createdAt: new Date()
        });

        alert("Case added with ID: " + docRef.id);
        document.getElementById('newCaseForm').reset();  // Reset form
        document.getElementById('createCaseModal').style.display = 'none';
        fetchCases();  // Refresh case list
    } catch (e) {
        console.error("Error adding case: ", e);
        alert("Error adding case: " + e.message);
    }
};

// Add event listener to the create case button
document.querySelector('.create-case-btn').addEventListener('click', () => {
    document.getElementById('createCaseModal').style.display = 'block';
});

// Close modal when clicking cancel or outside
document.querySelector('.cancel-btn').addEventListener('click', () => {
    document.getElementById('createCaseModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('createCaseModal')) {
        document.getElementById('createCaseModal').style.display = 'none';
    }
});

// Generate case number
function generateCaseNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}-${random}`;
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize filters
function initializeFilters() {
    const filters = {
        department: document.querySelector('select[data-filter="department"]'),
        status: document.querySelector('select[data-filter="status"]'),
        priority: document.querySelector('select[data-filter="priority"]')
    };

    Object.values(filters).forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

// Simple filter function (for demonstration)
async function applyFilters() {
    const department = document.querySelector('select[data-filter="department"]').value;
    const status = document.querySelector('select[data-filter="status"]').value;
    const priority = document.querySelector('select[data-filter="priority"]').value;

    const casesGrid = document.querySelector(".cases-grid");
    casesGrid.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "cases"));
    querySnapshot.forEach((doc) => {
        const caseData = doc.data();
        
        const matchesDepartment = department === "All Departments" || caseData.department === department;
        const matchesStatus = status === "All Status" || caseData.status === status;
        const matchesPriority = priority === "All Priorities" || caseData.priority === priority;

        if (matchesDepartment && matchesStatus && matchesPriority) {
            const caseElement = document.createElement("div");
            caseElement.classList.add("case-card");
            caseElement.innerHTML = `
                <h3>${caseData.title}</h3>
                <p>${caseData.description}</p>
                <p><strong>Priority:</strong> ${caseData.priority}</p>
                <p><strong>Status:</strong> ${caseData.status}</p>
            `;
            casesGrid.appendChild(caseElement);
        }
    });
}

// Ensure filters are applied on change
document.querySelectorAll('select[data-filter]').forEach(select => {
    select.addEventListener('change', applyFilters);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});