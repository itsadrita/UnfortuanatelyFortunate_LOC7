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