document.addEventListener('DOMContentLoaded', () => {
    // Load case data
    loadCaseData();
    
    // Initialize tabs
    initializeTabs();
    
    // Add event listeners
    setupEventListeners();
});

function loadCaseData() {
    // Fetch case data from server/localStorage
    const caseId = new URLSearchParams(window.location.search).get('id');
    // Add API call here to fetch case details
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and its content
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

function addLogEntry() {
    const modal = createModal('Add Investigation Log Entry');
    modal.innerHTML = `
        <form id="logEntryForm">
            <div class="form-group">
                <label>Date</label>
                <input type="date" required>
            </div>
            <div class="form-group">
                <label>Activity Type</label>
                <select required>
                    <option value="investigation">Investigation</option>
                    <option value="interview">Interview</option>
                    <option value="evidence">Evidence Collection</option>
                    <option value="report">Report Filing</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea required></textarea>
            </div>
            <div class="form-group">
                <label>Attachments</label>
                <input type="file" multiple>
            </div>
            <div class="modal-actions">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="submit-btn">Add Entry</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(modal);
}

function addEvidence() {
    const modal = createModal('Add Evidence');
    // Similar to addLogEntry but with evidence-specific fields
}

function generateReport() {
    // Generate PDF report with case details and evidence
}

function setupEventListeners() {
    document.querySelector('.add-log-btn').addEventListener('click', addLogEntry);
    document.querySelector('.add-evidence-btn').addEventListener('click', addEvidence);
    document.querySelector('.download-btn').addEventListener('click', generateReport);
}

function createModal(title) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    // Add modal HTML structure
    return modal;
}

// Modal Templates
const modalTemplates = {
    addParty: `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Involved Party</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addPartyForm">
                <div class="form-group">
                    <label>Party Type</label>
                    <select required name="partyType">
                        <option value="victim">Victim</option>
                        <option value="suspect">Suspect</option>
                        <option value="witness">Witness</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" required name="name">
                    </div>
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" required name="age">
                    </div>
                </div>
                <div class="form-group">
                    <label>Contact Information</label>
                    <input type="tel" required name="contact">
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea required name="address"></textarea>
                </div>
                <div class="form-group">
                    <label>Statement</label>
                    <textarea required name="statement"></textarea>
                </div>
                <div class="form-group">
                    <label>Photo</label>
                    <input type="file" accept="image/*" name="photo">
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Add Party</button>
                </div>
            </form>
        </div>
    `,

    addEvidence: `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Evidence</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addEvidenceForm">
                <div class="form-group">
                    <label>Evidence Type</label>
                    <select required name="evidenceType">
                        <option value="physical">Physical Evidence</option>
                        <option value="digital">Digital Evidence</option>
                        <option value="document">Document</option>
                        <option value="photo">Photograph</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea required name="description"></textarea>
                </div>
                <div class="form-group">
                    <label>Collection Date & Time</label>
                    <input type="datetime-local" required name="collectionDate">
                </div>
                <div class="form-group">
                    <label>Location Found</label>
                    <input type="text" required name="location">
                </div>
                <div class="form-group">
                    <label>Upload Files</label>
                    <input type="file" multiple name="files">
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Add Evidence</button>
                </div>
            </form>
        </div>
    `,

    addLogEntry: `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Investigation Log Entry</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addLogEntryForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" required name="date">
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" required name="time">
                    </div>
                </div>
                <div class="form-group">
                    <label>Activity Type</label>
                    <select required name="activityType">
                        <option value="investigation">Investigation</option>
                        <option value="interview">Interview/Interrogation</option>
                        <option value="evidence">Evidence Collection</option>
                        <option value="surveillance">Surveillance</option>
                        <option value="report">Report Writing</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea required name="description"></textarea>
                </div>
                <div class="form-group">
                    <label>Attachments</label>
                    <input type="file" multiple name="attachments">
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Add Entry</button>
                </div>
            </form>
        </div>
    `
};

// Show modal function
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    
    // Load appropriate form content based on modal type
    const content = getModalContent(modalId);
    modal.querySelector('.modal-content').innerHTML = content;
    
    // Add close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }
}

// Get modal content based on type
function getModalContent(modalId) {
    switch(modalId) {
        case 'addPartyModal':
            return `
                <div class="modal-header">
                    <h2>Add Involved Party</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form id="addPartyForm" onsubmit="handlePartySubmit(event)">
                    <div class="form-group">
                        <label>Party Type</label>
                        <select required name="partyType">
                            <option value="victim">Victim</option>
                            <option value="suspect">Suspect</option>
                            <option value="witness">Witness</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" required name="name">
                        </div>
                        <div class="form-group">
                            <label>Age</label>
                            <input type="number" required name="age">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Statement</label>
                        <textarea required name="statement"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Photo</label>
                        <input type="file" accept="image/*" name="photo">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeModal('addPartyModal')">Cancel</button>
                        <button type="submit" class="submit-btn">Add Party</button>
                    </div>
                </form>
            `;
        
        case 'addEvidenceModal':
            return `
                <div class="modal-header">
                    <h2>Add Evidence</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form id="addEvidenceForm" onsubmit="handleEvidenceSubmit(event)">
                    <div class="form-group">
                        <label>Evidence Type</label>
                        <select required name="evidenceType">
                            <option value="physical">Physical Evidence</option>
                            <option value="digital">Digital Evidence</option>
                            <option value="document">Document</option>
                            <option value="photo">Photograph</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea required name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Upload Files</label>
                        <input type="file" multiple name="files">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeModal('addEvidenceModal')">Cancel</button>
                        <button type="submit" class="submit-btn">Add Evidence</button>
                    </div>
                </form>
            `;
        
        case 'addLogModal':
            return `
                <div class="modal-header">
                    <h2>Add Investigation Log Entry</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form id="addLogEntryForm" onsubmit="handleLogSubmit(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" required name="date">
                        </div>
                        <div class="form-group">
                            <label>Time</label>
                            <input type="time" required name="time">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Activity Type</label>
                        <select required name="activityType">
                            <option value="investigation">Investigation</option>
                            <option value="interview">Interview/Interrogation</option>
                            <option value="evidence">Evidence Collection</option>
                            <option value="surveillance">Surveillance</option>
                            <option value="report">Report Writing</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea required name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Attachments</label>
                        <input type="file" multiple name="attachments">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeModal('addLogModal')">Cancel</button>
                        <button type="submit" class="submit-btn">Add Entry</button>
                    </div>
                </form>
            `;
    }
}

// Close modal function
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle form submissions with entry display
function handlePartySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Create party card
    const partyCard = createPartyCard({
        type: formData.get('partyType'),
        name: formData.get('name'),
        age: formData.get('age'),
        statement: formData.get('statement'),
        photo: formData.get('photo')
    });
    
    // Add to appropriate tab content
    const tabContent = document.getElementById(formData.get('partyType') + 's');
    tabContent.insertBefore(partyCard, tabContent.firstChild);
    
    closeModal('addPartyModal');
    showNotification('Party added successfully');
}

function handleEvidenceSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Create evidence card
    const evidenceCard = createEvidenceCard({
        type: formData.get('evidenceType'),
        description: formData.get('description'),
        files: formData.get('files')
    });
    
    // Add to evidence grid
    document.querySelector('.evidence-grid').insertBefore(evidenceCard, null);
    
    closeModal('addEvidenceModal');
    showNotification('Evidence added successfully');
}

function handleLogSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Create log entry
    const logEntry = createLogEntry({
        date: formData.get('date'),
        time: formData.get('time'),
        type: formData.get('activityType'),
        description: formData.get('description')
    });
    
    // Add to log entries
    document.querySelector('.log-entries').insertBefore(logEntry, null);
    
    closeModal('addLogModal');
    showNotification('Log entry added successfully');
}

// Create HTML elements for entries
function createPartyCard(data) {
    const card = document.createElement('div');
    card.className = 'party-card';
    card.innerHTML = `
        <div class="party-header">
            <div class="party-photo">
                ${data.photo ? `<img src="${URL.createObjectURL(data.photo)}" alt="${data.name}">` 
                            : `<i class="fas fa-user"></i>`}
            </div>
            <div class="party-info">
                <h3>${data.name}</h3>
                <span class="party-type ${data.type}">${data.type}</span>
            </div>
            <div class="party-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="party-details">
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Statement:</strong> ${data.statement}</p>
        </div>
    `;
    return card;
}

function createEvidenceCard(data) {
    const card = document.createElement('div');
    card.className = 'evidence-card';
    card.innerHTML = `
        <div class="evidence-icon">
            ${getEvidenceIcon(data.type)}
        </div>
        <div class="evidence-info">
            <h4>${data.type}</h4>
            <p>${data.description}</p>
            ${data.files ? `<span class="file-count"><i class="fas fa-paperclip"></i> ${data.files.length} files</span>` : ''}
        </div>
        <div class="evidence-actions">
            <button class="view-btn"><i class="fas fa-eye"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    return card;
}

function createLogEntry(data) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <div class="log-entry-header">
            <div class="log-entry-time">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(data.date)} ${data.time}</span>
            </div>
            <span class="activity-type ${data.type.toLowerCase()}">${data.type}</span>
        </div>
        <div class="log-entry-content">
            <p>${data.description}</p>
        </div>
        <div class="log-entry-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    return entry;
}

// Helper functions
function getEvidenceIcon(type) {
    const icons = {
        'physical': 'box',
        'digital': 'laptop',
        'document': 'file-alt',
        'photo': 'camera',
        'video': 'video'
    };
    return `<i class="fas fa-${icons[type] || 'folder'}"></i>`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
}); 