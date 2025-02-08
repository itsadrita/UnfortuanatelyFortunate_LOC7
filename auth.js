// Officer code patterns and validation
const OFFICER_CODES = {
    city: {
        CP: { pattern: /^CP\d+$/, role: 'Commissioner of Police' },
        JCP: { pattern: /^JCP\d+$/, role: 'Joint Commissioner of Police' },
        DCP: { pattern: /^DCP\d+$/, role: 'Deputy Commissioner of Police' },
        ACP: { pattern: /^ACP\d+$/, role: 'Assistant Commissioner of Police' }
    },
    station: {
        SHO: { pattern: /^SHO\d+$/, role: 'Station House Officer' },
        SI: { pattern: /^SI\d+$/, role: 'Sub-Inspector' },
        ASI: { pattern: /^ASI\d+$/, role: 'Assistant Sub-Inspector' }
    }
};

class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.loginTypeToggle = document.getElementById('loginTypeToggle');
        this.cityLevelLabel = document.querySelector('.city-level');
        this.stationLevelLabel = document.querySelector('.station-level');
        this.emailInput = document.getElementById('loginEmail');
        this.passwordInput = document.getElementById('loginPassword');
        this.officerCodeInput = document.getElementById('officerCode');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Toggle switch event listener
        this.loginTypeToggle.addEventListener('change', (e) => this.handleLoginTypeToggle(e));

        // Form submission event listener
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Officer code input validation
        this.officerCodeInput.addEventListener('input', (e) => this.validateOfficerCodeFormat(e));
    }

    handleLoginTypeToggle(event) {
        if (event.target.checked) {
            this.cityLevelLabel.classList.remove('active');
            this.stationLevelLabel.classList.add('active');
            this.officerCodeInput.placeholder = 'Station Level Code (SHO/SI/ASI)';
        } else {
            this.cityLevelLabel.classList.add('active');
            this.stationLevelLabel.classList.remove('active');
            this.officerCodeInput.placeholder = 'City Level Code (CP/JCP/DCP/ACP)';
        }
        // Clear the officer code input when switching types
        this.officerCodeInput.value = '';
    }

    validateOfficerCodeFormat(event) {
        const code = event.target.value.toUpperCase();
        event.target.value = code; // Force uppercase

        const isStationLevel = this.loginTypeToggle.checked;
        const validCodes = isStationLevel ? OFFICER_CODES.station : OFFICER_CODES.city;
        
        let isValid = false;
        for (const [prefix, details] of Object.entries(validCodes)) {
            if (code.startsWith(prefix)) {
                isValid = details.pattern.test(code);
                break;
            }
        }

        // Visual feedback
        if (code) {
            event.target.style.borderColor = isValid ? 'green' : 'red';
        } else {
            event.target.style.borderColor = ''; // Reset to default
        }
    }

    validateOfficerCode(code) {
        const isStationLevel = this.loginTypeToggle.checked;
        const validCodes = isStationLevel ? OFFICER_CODES.station : OFFICER_CODES.city;
        
        for (const [prefix, details] of Object.entries(validCodes)) {
            if (code.startsWith(prefix) && details.pattern.test(code)) {
                return {
                    valid: true,
                    role: details.role,
                    level: isStationLevel ? 'station' : 'city'
                };
            }
        }
        
        return { valid: false };
    }

    async handleLogin(event) {
        event.preventDefault();

        const loginData = {
            email: this.emailInput.value,
            password: this.passwordInput.value,
            officerCode: this.officerCodeInput.value.toUpperCase(),
            isStationLevel: this.loginTypeToggle.checked
        };

        // Validate officer code
        const codeValidation = this.validateOfficerCode(loginData.officerCode);
        if (!codeValidation.valid) {
            this.showError('Invalid officer code format');
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            const response = await this.performLogin(loginData);
            
            if (response.success) {
                // Store necessary data in localStorage/sessionStorage
                localStorage.setItem('userRole', codeValidation.role);
                localStorage.setItem('accessLevel', codeValidation.level);
                localStorage.setItem('officerCode', loginData.officerCode);
                
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
            } else {
                this.showError(response.message || 'Login failed');
            }
        } catch (error) {
            this.showError('An error occurred during login');
            console.error('Login error:', error);
        }
    }

    async performLogin(loginData) {
        // Mock API call - Replace with actual API endpoint
        // return await fetch('/api/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(loginData)
        // }).then(res => res.json());

        // For demonstration, returning mock response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Login successful'
                });
            }, 1000);
        });
    }

    showError(message) {
        // You can implement a more sophisticated error display mechanism
        alert(message);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
}); 