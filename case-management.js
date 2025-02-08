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
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Create Case</button>
                </div>
            </form>
        </div>
    </div>
`);

// Function to add a case card to the UI
function addCaseCard(caseData) {
    const casesGrid = document.querySelector('.cases-grid');
    const caseCard = document.createElement('div');
    caseCard.className = 'case-card';
    caseCard.innerHTML = `
        <div class="case-header">
            <span class="case-id">#${caseData.caseNumber}</span>
            <span class="priority-badge ${caseData.priority.toLowerCase()}">${caseData.priority} Priority</span>
        </div>
        <h3>${caseData.title}</h3>
        <p class="case-description">${caseData.description}</p>
        <div class="case-details">
            <div class="detail-item">
                <i class="fas fa-user"></i>
                <span>${caseData.assignedTo || 'Unassigned'}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${new Date().toLocaleDateString()}</span>
            </div>
        </div>
        <div class="case-footer">
            <span class="status-badge open">Open</span>
            <button class="view-case-btn">View Details</button>
        </div>
    `;
    casesGrid.prepend(caseCard);
}

// Handle new case creation
const createCaseBtn = document.querySelector('.create-case-btn');
const modal = document.getElementById('createCaseModal');

createCaseBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Handle form submission
document.getElementById('createCaseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const caseData = {
        title: document.getElementById('caseTitle').value,
        description: document.getElementById('caseDescription').value,
        department: document.getElementById('caseDepartment').value,
        priority: document.getElementById('casePriority').value,
        status: 'Open',
        caseNumber: generateCaseNumber(),
        assignedTo: 'Unassigned',
        date: new Date().toLocaleDateString()
    };

    // Add case card to UI
    addCaseCard(caseData);
    
    // Close modal and reset form
    modal.style.display = 'none';
    document.getElementById('createCaseForm').reset();

    showNotification('Case created successfully', 'success');
});

// Close modal when clicking cancel or outside
document.querySelector('.cancel-btn').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
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
function applyFilters() {
    const department = document.querySelector('select[data-filter="department"]').value;
    const status = document.querySelector('select[data-filter="status"]').value;
    const priority = document.querySelector('select[data-filter="priority"]').value;

    const cards = document.querySelectorAll('.case-card');
    cards.forEach(card => {
        const cardDepartment = card.querySelector('.department')?.textContent;
        const cardStatus = card.querySelector('.status-badge')?.textContent;
        const cardPriority = card.querySelector('.priority-badge')?.textContent.replace(' Priority', '');

        const shouldShow = 
            (department === 'All Departments' || cardDepartment === department) &&
            (status === 'All Status' || cardStatus === status) &&
            (priority === 'All Priorities' || cardPriority === priority);

        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});