import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Function to fetch and display user data
async function fetchUserData(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update the navigation user info
            document.getElementById('navUserName').textContent = userData.fullName || 'User';
            document.getElementById('navUserRank').textContent = userData.rank || 'Role';
            
            // Store role in localStorage and sessionStorage
            localStorage.setItem('userRole', userData.rank);
            sessionStorage.setItem('userRole', userData.rank);
            
            // Call renderNavigation from script.js
            window.renderNavigation(userData.rank);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Check authentication and role
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRole = sessionStorage.getItem('userRole');
        if (!userRole) {
            // If no role in session storage, fetch user data
            await fetchUserData(user.uid);
        } else if (userRole === 'Station House Officer' || userRole === 'SHO') {
            // If role exists, just render navigation
            window.renderNavigation(userRole);
        } else {
            // Redirect if not SHO
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

// Make sure renderNavigation is available globally
if (typeof window.renderNavigation !== 'function') {
    window.renderNavigation = function(userRole) {
        const normalizedRole = userRole ? userRole.trim().toUpperCase() : '';
        const navList = document.querySelector('#main-nav');
        
        if (!navList) {
            console.error('Navigation list element not found');
            return;
        }
        
        // Base navigation items (common for all roles)
        let navItems = [
            {
                href: 'index.html',
                icon: 'fa-home',
                text: 'Dashboard'
            }
        ];

        // Add SHO-specific navigation items
        if (normalizedRole === 'STATION HOUSE OFFICER' || normalizedRole === 'SHO') {
            navItems = navItems.concat([
                {
                    href: 'case-management.html',
                    icon: 'fa-tasks',
                    text: 'Case Management'
                },
                {
                    href: 'officer-management.html',
                    icon: 'fa-users',
                    text: 'Officer Management'
                },
                {
                    href: 'grievance.html',
                    icon: 'fa-exclamation-circle',
                    text: 'Grievance'
                }
            ]);
        }

        // Add settings for all roles
        navItems.push({
            href: 'settings.html',
            icon: 'fa-cog',
            text: 'Settings'
        });

        // Generate navigation HTML
        navList.innerHTML = navItems.map(item => `
            <li class="${window.location.pathname.includes(item.href) ? 'active' : ''}">
                <a href="${item.href}">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            </li>
        `).join('');
    };
}

// Your existing office management functionality here
// ... (duty assignment, timetable creation, etc.) 