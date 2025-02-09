document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if viewing specific case or cases list
        const caseId = new URLSearchParams(window.location.search).get('id');
        
        if (caseId) {
            // Load specific case details
            loadCaseDetails(caseId);
        } else {
            // Show assigned cases list
            showAssignedCases();
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('Error loading data', 'error');
    }
    initializeDailyLog();
    initializeUpdates();
    initializeEvidence();
});

// Dummy data for demonstration
const dummyCases = [
    {
        id: "CASE001",
        title: "Robbery at Main Street",
        date: "2024-03-15",
        status: "Active",
        priority: "High",
        description: "Armed robbery reported at 123 Main Street jewelry store"
    },
    {
        id: "CASE002",
        title: "Vehicle Theft",
        date: "2024-03-14",
        status: "Active",
        priority: "Medium",
        description: "White Toyota Camry stolen from downtown parking"
    }
];

// Show list of assigned cases
function showAssignedCases() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="assigned-cases">
            <h1>Assigned Cases</h1>
            <div class="cases-grid">
                ${dummyCases.map(caseItem => `
                    <div class="case-card" onclick="window.location.href='case-file.html?id=${caseItem.id}'">
                        <div class="case-card-header">
                            <h3>${caseItem.title}</h3>
                            <span class="case-badge ${caseItem.priority.toLowerCase()}">${caseItem.priority}</span>
                        </div>
                        <div class="case-card-content">
                            <p><strong>Case ID:</strong> ${caseItem.id}</p>
                            <p><strong>Date:</strong> ${caseItem.date}</p>
                            <p><strong>Status:</strong> ${caseItem.status}</p>
                            <p>${caseItem.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add necessary styles
    addCaseListStyles();
}

// Load specific case details
function loadCaseDetails(caseId) {
    // Find case from dummy data
    const caseDetails = dummyCases.find(c => c.id === caseId);
    
    if (!caseDetails) {
        showNotification('Case not found', 'error');
        return;
    }

    // Update case header
    document.querySelector('.case-title h1').textContent = caseDetails.title;
    document.querySelector('.status-badge').textContent = caseDetails.status;
    document.querySelector('.priority-badge').textContent = `${caseDetails.priority} Priority`;

    // Initialize event listeners for modals
    initializeModals();
}

// Cloudinary Upload Widget Configuration
let uploadedFiles = [];

const evidenceWidget = cloudinary.createUploadWidget({
    cloudName: 'dv2gmz2if',
    uploadPreset: 'SARK',
    sources: ['local', 'url'],
    multiple: true,
    folder: 'evidence', // Base folder
    resourceType: 'auto', // Automatically detect resource type
    clientAllowedFormats: ['jpg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'doc', 'docx'],
    maxFiles: 10,
    maxFileSize: 20000000, // 20MB
}, (error, result) => {
    if (!error && result && result.event === "success") {
        handleUploadSuccess(result);
    }
});

function handleUploadSuccess(result) {
    const previewContainer = document.getElementById('evidencePreview');
    const evidenceType = document.getElementById('evidenceType').value;
    
    // Store uploaded file info
    uploadedFiles.push({
        url: result.info.secure_url,
        type: result.info.resource_type,
        format: result.info.format,
        originalName: result.info.original_filename
    });

    // Create preview element
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';

    if (result.info.resource_type === 'image') {
        previewItem.innerHTML = `
            <img src="${result.info.thumbnail_url || result.info.secure_url}" alt="Evidence">
            <span class="filename">${result.info.original_filename}</span>
        `;
    } else if (result.info.resource_type === 'video') {
        previewItem.innerHTML = `
            <video width="150" height="100" controls>
                <source src="${result.info.secure_url}" type="video/${result.info.format}">
            </video>
            <span class="filename">${result.info.original_filename}</span>
        `;
    } else {
        previewItem.innerHTML = `
            <div class="document-preview">
                <i class="fas fa-file-alt"></i>
                <span class="filename">${result.info.original_filename}</span>
            </div>
        `;
    }

    previewContainer.appendChild(previewItem);
}

// Modified evidence form submission
function initializeModals() {
    // Update form submission
    document.getElementById('updateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        addUpdate({
            date: formData.get('date'),
            time: formData.get('time'),
            details: formData.get('details'),
            attachments: formData.get('attachments')
        });
        closeModal('addUpdateModal');
    });

    // Evidence form submission
    document.getElementById('evidenceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Add uploaded files to evidence data
        const evidenceData = {
            type: formData.get('type'),
            description: formData.get('description'),
            location: formData.get('location'),
            files: uploadedFiles
        };

        addEvidence(evidenceData);
        uploadedFiles = []; // Reset uploaded files array
        closeModal('addEvidenceModal');
    });

    // Initialize upload widget button
    document.getElementById('evidenceUploadWidget').addEventListener('click', function() {
        evidenceWidget.open();
    });

    // Add grant access button handler
    document.getElementById('grantAccessButton').addEventListener('click', function() {
        window.open("https://upload-request.cloudinary.com/dv2gmz2if/5fc22d5e10125118539cc599d4ee06ec", "_blank");
    });
}

// Add investigation update
function addUpdate(updateData) {
    const updatesList = document.querySelector('.updates-list');
    const updateElement = document.createElement('div');
    updateElement.className = 'update-entry';
    updateElement.innerHTML = `
        <div class="update-header">
            <span class="update-time">${updateData.date} ${updateData.time}</span>
        </div>
        <div class="update-content">
            <p>${updateData.details}</p>
            ${updateData.attachments ? `<div class="attachments">
                <i class="fas fa-paperclip"></i> ${updateData.attachments.name}
            </div>` : ''}
        </div>
    `;
    updatesList.insertBefore(updateElement, updatesList.firstChild);
    showNotification('Update added successfully');
}

// Modified addEvidence function
function addEvidence(evidenceData) {
    const evidences = JSON.parse(localStorage.getItem(`evidences_${getCaseId()}`) || '[]');
    evidences.push(evidenceData);
    localStorage.setItem(`evidences_${getCaseId()}`, JSON.stringify(evidences));

    // Update the UI
    displayEvidence();
    closeModal('addEvidenceModal');
    showNotification('Evidence added successfully');
}

// Display evidence in the main interface
function displayEvidence() {
    const evidences = JSON.parse(localStorage.getItem(`evidences_${getCaseId()}`) || '[]');
    const evidenceContainer = document.querySelector('.evidence-list');
    
    evidenceContainer.innerHTML = evidences.map(evidence => `
        <div class="evidence-item">
            <div class="evidence-type">
                <i class="fas fa-${getEvidenceIcon(evidence.type)}"></i>
            </div>
            <div class="evidence-details">
                <h4>${evidence.type}</h4>
                <p>${evidence.description}</p>
                <small><i class="fas fa-map-marker-alt"></i> ${evidence.location}</small>
                <div class="evidence-files">
                    ${evidence.files.map(file => {
                        if (file.type === 'image') {
                            return `<img src="${file.url}" alt="Evidence" class="evidence-preview">`;
                        } else if (file.type === 'video') {
                            return `<video controls class="evidence-preview">
                                        <source src="${file.url}" type="video/${file.format}">
                                    </video>`;
                        } else {
                            return `<a href="${file.url}" target="_blank" class="document-link">
                                        <i class="fas fa-file-alt"></i> ${file.originalName}
                                    </a>`;
                        }
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Helper functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    
    // Load appropriate form content based on modal type
    const content = getModalContent(modalId);
    modal.querySelector('.modal-content').innerHTML = content;
    
    // Add close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => closeModal(modalId);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function getEvidenceIcon(type) {
    const icons = {
        'photo': 'camera',
        'video': 'video',
        'document': 'file-alt',
        'physical': 'box'
    };
    return icons[type] || 'folder';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Add styles for case list view
function addCaseListStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .assigned-cases {
            padding: 20px;
        }
        .cases-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .case-card {
            background-color: var(--card-background-dark);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .case-card:hover {
            transform: translateY(-2px);
        }
        .case-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .case-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
        }
        .case-badge.high { background-color: rgba(231, 76, 60, 0.2); color: #e74c3c; }
        .case-badge.medium { background-color: rgba(241, 196, 15, 0.2); color: #f1c40f; }
        .case-badge.low { background-color: rgba(46, 204, 113, 0.2); color: #2ecc71; }
    `;
    document.head.appendChild(style);
}

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
        </div>
    `,

    addLogEntry: `
        <div class="modal-content">
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
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Add Entry</button>
                </div>
            </form>
        </div>
    `
};

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
        <div class="evidence-details">
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

// Update the progress tracker steps and their order
const progressSteps = {
    'io-assigned': {
        icon: 'fa-user-shield',
        label: 'IO Assigned',
        order: 1
    },
    'fir-report': {
        icon: 'fa-file-alt',
        label: 'FIR Report',
        order: 2
    },
    'investigation': {
        icon: 'fa-search',
        label: 'Investigation',
        order: 3
    },
    'final-report': {
        icon: 'fa-file-contract',
        label: 'Final Report',
        order: 4
    },
    'closed': {
        icon: 'fa-check-circle',
        label: 'Closed',
        order: 5
    }
};

// Function to update progress tracker
function updateProgressTracker(currentStep) {
    const progressTracker = document.querySelector('.progress-tracker');
    progressTracker.innerHTML = '';

    Object.entries(progressSteps)
        .sort((a, b) => a[1].order - b[1].order)
        .forEach(([stepId, step]) => {
            const milestone = document.createElement('div');
            milestone.className = 'milestone';
            milestone.dataset.step = stepId; // Add data attribute for step identification
            
            // Add appropriate classes based on current progress
            if (step.order < progressSteps[currentStep].order) {
                milestone.classList.add('completed');
            } else if (stepId === currentStep) {
                milestone.classList.add('active');
            }

            milestone.innerHTML = `
                <i class="fas ${step.icon}"></i>
                <span>${step.label}</span>
            `;

            // Add click handler to each milestone
            milestone.addEventListener('click', () => {
                moveToStep(stepId);
            });
            
            progressTracker.appendChild(milestone);
        });
}

// Function to move to a specific step
function moveToStep(targetStep) {
    const currentStep = getCurrentStep();
    
    // Only allow moving to the next step in sequence
    if (progressSteps[targetStep].order === progressSteps[currentStep].order + 1) {
        updateProgressTracker(targetStep);
        handleProgressStep(targetStep);
        // Save the current step to localStorage
        localStorage.setItem('currentStep', targetStep);
        showNotification(`Moved to ${progressSteps[targetStep].label}`);
    }
}

// Function to get current step
function getCurrentStep() {
    const activeStep = document.querySelector('.milestone.active');
    return activeStep ? activeStep.dataset.step : 'io-assigned';
}

// Add this to your CSS to make milestones look clickable
function addProgressTrackerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .milestone {
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .milestone:hover {
            transform: translateY(-2px);
        }
        
        .milestone:not(.completed):not(.active) {
            opacity: 0.7;
        }
        
        .milestone.completed:hover,
        .milestone.active:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Function to handle progress step actions
function handleProgressStep(step) {
    switch(step) {
        case 'io-assigned':
            // Show case details and enable FIR report generation
            document.querySelector('.fir-details').style.display = 'block';
            break;
        
        case 'fir-report':
            // Enable investigation tools and show FIR report link
            document.querySelector('.investigation-tools').style.display = 'block';
            document.querySelector('.fir-report-btn').innerHTML = `
                <a href="reportgen.html?type=fir&id=${getCaseId()}" class="generate-btn">
                    <i class="fas fa-file-export"></i> Generate FIR Report
                </a>
            `;
            break;
            
        case 'investigation':
            // Enable evidence collection and log entries
            document.querySelector('.evidence').style.display = 'block';
            document.querySelector('.investigation-log').style.display = 'block';
            break;
            
        case 'final-report':
            // Enable final report generation
            document.querySelector('.final-report-section').style.display = 'block';
            document.querySelector('.final-report-btn').innerHTML = `
                <a href="reportgen.html?type=final&id=${getCaseId()}" class="generate-btn">
                    <i class="fas fa-file-export"></i> Generate Final Report
                </a>
            `;
            break;
            
        case 'closed':
            // Disable editing and show case summary
            disableEditing();
            showCaseSummary();
            break;
    }
}

// Helper function to get case ID from URL
function getCaseId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '';
}

// Update the HTML structure in case-file.html to match the new progress steps: 

// Initialize daily log functionality
function initializeDailyLog() {
    // Set today's date by default
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[name="logDate"]').value = today;

    // Load existing tasks if any
    loadScheduledTasks();

    // Ensure modal is initialized only once
    const dailyLogModal = document.getElementById('dailyLogModal');
    if (dailyLogModal) {
        dailyLogModal.querySelector('.cancel-btn').addEventListener('click', () => closeModal('dailyLogModal'));
    }
}

// Add task to tomorrow's schedule
function addScheduledTask() {
    const input = document.getElementById('newTaskInput');
    const taskText = input.value.trim();
    
    if (taskText) {
        const taskList = document.getElementById('scheduledTasks');
        const taskElement = document.createElement('div');
        taskElement.className = 'scheduled-task';
        taskElement.innerHTML = `
            <label class="task-checkbox">
                <input type="checkbox">
                <span class="checkmark"></span>
                <span class="task-text">${taskText}</span>
            </label>
            <button class="delete-task" onclick="deleteTask(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        taskList.appendChild(taskElement);
        input.value = '';
        
        // Save tasks to localStorage
        saveScheduledTasks();
    }
}

// Delete task
function deleteTask(button) {
    button.parentElement.remove();
    saveScheduledTasks();
}

// Save tasks to localStorage
function saveScheduledTasks() {
    const tasks = [];
    document.querySelectorAll('.scheduled-task').forEach(taskElement => {
        tasks.push({
            text: taskElement.querySelector('.task-text').textContent,
            completed: taskElement.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem(`tasks_${getCaseId()}`, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadScheduledTasks() {
    const tasks = JSON.parse(localStorage.getItem(`tasks_${getCaseId()}`) || '[]');
    const taskList = document.getElementById('scheduledTasks');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'scheduled-task';
        taskElement.innerHTML = `
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span class="task-text">${task.text}</span>
            </label>
            <button class="delete-task" onclick="deleteTask(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        taskList.appendChild(taskElement);
    });
}

// Save daily logs
function saveDailyLog() {
    const formData = new FormData(document.getElementById('todayLogForm'));
    const logData = {
        date: formData.get('logDate'),
        activities: formData.get('activities'),
        findings: formData.get('findings'),
        scheduledTasks: Array.from(document.querySelectorAll('.scheduled-task')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.querySelector('input[type="checkbox"]').checked
        }))
    };

    // Save to localStorage (you can modify this to save to your backend)
    const logs = JSON.parse(localStorage.getItem(`logs_${getCaseId()}`) || '[]');
    logs.push(logData);
    localStorage.setItem(`logs_${getCaseId()}`, JSON.stringify(logs));

    // Update the UI
    displayDailyLogs();
    closeModal('dailyLogModal');
    showNotification('Daily log saved successfully');
}

// Display daily logs in the main interface
function displayDailyLogs() {
    const logs = JSON.parse(localStorage.getItem(`logs_${getCaseId()}`) || '[]');
    const logsContainer = document.querySelector('.daily-logs-list') || createLogsContainer();
    
    logsContainer.innerHTML = logs.map(log => `
        <div class="log-entry">
            <div class="log-date">${new Date(log.date).toLocaleDateString()}</div>
            <div class="log-content">
                <h4>Activities</h4>
                <p>${log.activities}</p>
                ${log.findings ? `
                    <h4>Key Findings</h4>
                    <p>${log.findings}</p>
                ` : ''}
                ${log.scheduledTasks.length ? `
                    <h4>Scheduled Tasks</h4>
                    <ul class="task-list">
                        ${log.scheduledTasks.map(task => `
                            <li class="${task.completed ? 'completed' : ''}">${task.text}</li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Create logs container if it doesn't exist
function createLogsContainer() {
    const container = document.createElement('div');
    container.className = 'daily-logs-list';
    document.querySelector('.case-content').appendChild(container);
    return container;
}

// Initialize evidence functionality
function initializeEvidence() {
    displayEvidence();
} 