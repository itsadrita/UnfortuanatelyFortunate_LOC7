// Add the modal HTML to the page
document.body.insertAdjacentHTML('beforeend', `
    <div id="createCaseModal" class="modal" style="display: none;">
        <div class="modal-content">
            <h2>Case Assignment</h2>
            <form id="caseAssignmentForm">
                <div class="form-group">
                    <label for="fir_number">FIR Number:</label>
                    <input type="text" id="fir_number" name="fir_number" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crime_type">Crime Type:</label>
                        <select id="crime_type" name="crime_type" required>
                            <option value="">Select Crime Type</option>
                            <option value="Homicide">Homicide</option>
                            <option value="Burglary">Burglary</option>
                            <option value="Cyber Crime">Cyber Crime</option>
                            <option value="Kidnapping">Kidnapping</option>
                            <option value="Narcotics">Narcotics</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="police_station">Police Station:</label>
                        <select id="police_station" name="police_station" required>
                            <option value="">Select Police Station</option>
                            <option value="Andheri">Andheri Police Station</option>
                            <option value="Bandra">Bandra Police Station</option>
                            <option value="Colaba">Colaba Police Station</option>
                            <option value="Dadar">Dadar Police Station</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="investigating_officer">Investigating Officer:</label>
                        <select id="investigating_officer" name="investigating_officer" required>
                            <option value="">Select Officer</option>
                            <option value="IO_1">Insp. Sharma</option>
                            <option value="IO_2">ASI Priya</option>
                            <option value="IO_3">Insp. Verma</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="priority">Case Priority:</label>
                        <select id="priority" name="priority" required>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="expected_date">Expected Resolution Date:</label>
                    <input type="date" id="expected_date" name="expected_date" required>
                </div>

                <div class="form-group">
                    <label for="investigation_notes">Investigation Notes:</label>
                    <textarea id="investigation_notes" name="investigation_notes" required></textarea>
                </div>

                <div class="form-group">
                    <label for="attachments">Upload Documents:</label>
                    <input type="file" id="attachments" name="attachments" multiple>
                    <small class="file-hint">Supported formats: PDF, DOC, JPG (Max 5MB)</small>
                </div>

                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Assign Case</button>
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
            <span class="case-id">FIR #${caseData.firNumber}</span>
            <span class="priority-badge ${caseData.status.toLowerCase()}">${caseData.status}</span>
        </div>
        <h3>${caseData.title}</h3>
        <div class="case-meta">
            <span class="crime-type"><i class="fas fa-file-alt"></i> ${caseData.crimeType}</span>
            <span class="police-station"><i class="fas fa-building"></i> ${caseData.policeStation}</span>
        </div>
        <p class="case-description">${caseData.description}</p>
        <div class="case-details">
            <div class="detail-item">
                <i class="fas fa-user-shield"></i>
                <span>${caseData.investigatingOfficer}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>Filed: ${caseData.filingDate}</span>
            </div>
        </div>
        <div class="case-progress">
            <div class="progress-bar">
                <div class="progress" style="width: ${caseData.progress}%"></div>
            </div>
            <span>${caseData.progress}% Complete</span>
        </div>
        <div class="case-footer">
            <div class="action-buttons">
                <button class="view-case-btn"><i class="fas fa-folder-open"></i> View File</button>
                <button class="update-btn"><i class="fas fa-edit"></i> Update</button>
                <button class="escalate-btn"><i class="fas fa-exclamation-triangle"></i> Escalate</button>
            </div>
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
document.getElementById('caseAssignmentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const caseData = {
        firNumber: document.getElementById('fir_number').value,
        crimeType: document.getElementById('crime_type').value,
        policeStation: document.getElementById('police_station').value,
        investigatingOfficer: document.getElementById('investigating_officer').value,
        priority: document.getElementById('priority').value,
        expectedDate: document.getElementById('expected_date').value,
        description: document.getElementById('investigation_notes').value,
        status: 'Active',
        progress: 0,
        filingDate: new Date().toLocaleDateString()
    };

    // Add case card to UI
    addCaseCard(caseData);
    
    // Close modal and reset form
    modal.style.display = 'none';
    document.getElementById('caseAssignmentForm').reset();

    showNotification('Case assigned successfully', 'success');
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