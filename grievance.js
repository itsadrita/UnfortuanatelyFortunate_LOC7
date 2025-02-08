// Sample data for grievances
const grievances = [
    {
        id: "GR-2024-001",
        title: "Traffic Signal Malfunction",
        category: "Traffic",
        priority: "high",
        status: "pending",
        location: "Main Street & 5th Avenue",
        description: "Traffic signal at intersection not functioning properly during peak hours",
        submittedBy: "John Smith",
        submittedDate: "2024-01-15",
        timeline: [
            {
                action: "Grievance Submitted",
                date: "2024-01-15 09:30 AM",
                by: "John Smith"
            },
            {
                action: "Assigned to Traffic Department",
                date: "2024-01-15 10:15 AM",
                by: "System"
            }
        ]
    },
    // Add more sample grievances
];

// Initialize grievance list
function initializeGrievanceList() {
    const grievanceItems = document.querySelector('.grievance-items');
    grievances.forEach(grievance => {
        const item = createGrievanceItem(grievance);
        grievanceItems.appendChild(item);
    });
}

function createGrievanceItem(grievance) {
    const div = document.createElement('div');
    div.className = 'grievance-item';
    div.innerHTML = `
        <div class="grievance-header">
            <span class="grievance-id">${grievance.id}</span>
            <span class="grievance-priority priority-${grievance.priority}">${grievance.priority.toUpperCase()}</span>
        </div>
        <h4>${grievance.title}</h4>
        <p class="grievance-category">${grievance.category}</p>
        <div class="grievance-meta">
            <span><i class="fas fa-map-marker-alt"></i> ${grievance.location}</span>
            <span><i class="fas fa-clock"></i> ${grievance.submittedDate}</span>
        </div>
    `;
    
    div.addEventListener('click', () => showGrievanceDetails(grievance));
    return div;
}

function showGrievanceDetails(grievance) {
    const detailsContent = document.querySelector('.details-content');
    detailsContent.innerHTML = `
        <div class="details-section">
            <h4>${grievance.title}</h4>
            <div class="meta-info">
                <span class="status ${grievance.status}">${grievance.status}</span>
                <span class="priority priority-${grievance.priority}">${grievance.priority}</span>
            </div>
            <p class="description">${grievance.description}</p>
            
            <div class="info-grid">
                <div class="info-item">
                    <label>Category</label>
                    <span>${grievance.category}</span>
                </div>
                <div class="info-item">
                    <label>Location</label>
                    <span>${grievance.location}</span>
                </div>
                <div class="info-item">
                    <label>Submitted By</label>
                    <span>${grievance.submittedBy}</span>
                </div>
                <div class="info-item">
                    <label>Submitted Date</label>
                    <span>${grievance.submittedDate}</span>
                </div>
            </div>

            <div class="timeline">
                ${grievance.timeline.map(event => `
                    <div class="timeline-item">
                        <h5>${event.action}</h5>
                        <p>${event.date}</p>
                        <span>By: ${event.by}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Handle filter changes
document.querySelectorAll('.filter-group select').forEach(select => {
    select.addEventListener('change', (e) => {
        // Add your filtering logic here
        console.log('Filter changed:', e.target.value);
    });
});

// Initialize the interface
document.addEventListener('DOMContentLoaded', () => {
    initializeGrievanceList();
    // Show first grievance details by default
    if (grievances.length > 0) {
        showGrievanceDetails(grievances[0]);
    }
});

// Handle new grievance button
document.querySelector('.new-grievance-btn').addEventListener('click', () => {
    // Add your new grievance creation logic here
    console.log('New grievance button clicked');
});

// Handle status update button
document.querySelector('.status-update-btn').addEventListener('click', () => {
    // Add your status update logic here
    console.log('Status update button clicked');
});

// Handle assign button
document.querySelector('.assign-btn').addEventListener('click', () => {
    // Add your assignment logic here
    console.log('Assign button clicked');
}); 