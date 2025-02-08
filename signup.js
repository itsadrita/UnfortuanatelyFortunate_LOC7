class SignupManager {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.loginTypeToggle = document.getElementById('loginTypeToggle');
        this.initializeFormElements();
        this.initializeEventListeners();
        this.populateStationsAndRanks();
    }

    initializeFormElements() {
        this.elements = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            badgeNumber: document.getElementById('badgeNumber'),
            policeStation: document.getElementById('policeStation'),
            rank: document.getElementById('rank'),
            joiningDate: document.getElementById('joiningDate'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            officerCode: document.getElementById('officerCode')
        };
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.loginTypeToggle.addEventListener('change', () => this.updateRankOptions());
        this.elements.password.addEventListener('input', () => this.checkPasswordStrength());
        this.elements.officerCode.addEventListener('input', () => this.validateOfficerCode());
    }

    populateStationsAndRanks() {
        // Populate police stations (example data)
        const stations = [
            'Central Police Station',
            'North District Station',
            'South District Station',
            'East District Station',
            'West District Station'
        ];

        const stationSelect = this.elements.policeStation;
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            stationSelect.appendChild(option);
        });

        this.updateRankOptions();
    }

    updateRankOptions() {
        const isStationLevel = this.loginTypeToggle.checked;
        const rankSelect = this.elements.rank;
        rankSelect.innerHTML = '<option value="">Select Rank</option>';

        const ranks = isStationLevel ? 
            ['SHO', 'SI', 'ASI'] : 
            ['CP', 'JCP', 'DCP', 'ACP'];

        ranks.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = rank;
            rankSelect.appendChild(option);
        });
    }

    validateOfficerCode() {
        const code = this.elements.officerCode.value.toUpperCase();
        this.elements.officerCode.value = code;

        const isStationLevel = this.loginTypeToggle.checked;
        const validPrefixes = isStationLevel ? 
            ['SHO', 'SI', 'ASI'] : 
            ['CP', 'JCP', 'DCP', 'ACP'];

        const isValid = validPrefixes.some(prefix => 
            code.startsWith(prefix) && /^[A-Z]+\d+$/.test(code)
        );

        this.elements.officerCode.style.borderColor = code ? 
            (isValid ? '#48BB78' : '#E53E3E') : 
            '#e2e8f0';

        return isValid;
    }

    checkPasswordStrength() {
        const password = this.elements.password.value;
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthBar = document.querySelector('.password-strength-bar');
        if (!strengthBar) return;

        switch(strength) {
            case 0:
            case 1:
                strengthBar.style.width = '33%';
                strengthBar.className = 'password-strength-bar strength-weak';
                break;
            case 2:
            case 3:
                strengthBar.style.width = '66%';
                strengthBar.className = 'password-strength-bar strength-medium';
                break;
            case 4:
                strengthBar.style.width = '100%';
                strengthBar.className = 'password-strength-bar strength-strong';
                break;
        }
    }

    validateForm() {
        let isValid = true;
        const errors = {};

        // Basic validation
        if (!this.elements.fullName.value.match(/^[A-Za-z\s]{3,}$/)) {
            errors.fullName = 'Please enter a valid name (minimum 3 characters)';
            isValid = false;
        }

        if (!this.elements.email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!this.elements.phone.value.match(/^\d{10}$/)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        if (this.elements.password.value !== this.elements.confirmPassword.value) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!this.validateOfficerCode()) {
            errors.officerCode = 'Invalid officer code format';
            isValid = false;
        }

        return { isValid, errors };
    }

    async handleSubmit(event) {
        event.preventDefault();

        const validation = this.validateForm();
        if (!validation.isValid) {
            this.showErrors(validation.errors);
            return;
        }

        const formData = {
            fullName: this.elements.fullName.value,
            email: this.elements.email.value,
            phone: this.elements.phone.value,
            badgeNumber: this.elements.badgeNumber.value,
            policeStation: this.elements.policeStation.value,
            rank: this.elements.rank.value,
            joiningDate: this.elements.joiningDate.value,
            password: this.elements.password.value,
            officerCode: this.elements.officerCode.value,
            isStationLevel: this.loginTypeToggle.checked
        };

        try {
            const response = await this.submitRegistration(formData);
            if (response.success) {
                alert('Registration successful! Please wait for verification.');
                window.location.href = 'login.html';
            } else {
                alert(response.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    }

    async submitRegistration(formData) {
        // Mock API call - Replace with actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Registration successful'
                });
            }, 1000);
        });
    }

    showErrors(errors) {
        // Clear existing errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Show new errors
        Object.entries(errors).forEach(([field, message]) => {
            const element = this.elements[field];
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            element.parentNode.appendChild(errorDiv);
            element.classList.add('input-error');
        });
    }
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupManager();
}); 