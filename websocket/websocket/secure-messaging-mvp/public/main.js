// public/main.js
let socket;
let token;

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  renderNavigation(userRole);

  const socket = io('http://localhost:3000');

  const loginForm = document.getElementById('login-form');
  const chatContainer = document.getElementById('chat-container');
  const loginContainer = document.getElementById('login-container');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const messagesDiv = document.getElementById('messages');
  const logoutBtn = document.getElementById('logout-btn');
  const loginError = document.getElementById('login-error');
  const loggedInUser = document.getElementById('logged-in-user');

  // Check if user is already logged in
  const username = localStorage.getItem('username');
  if (username) {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    loggedInUser.textContent = `Logged in as: ${username}`;
    socket.emit('login', username);
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Here you can add actual authentication logic
    socket.emit('login', username);
    localStorage.setItem('username', username);
    loggedInUser.textContent = `Logged in as: ${username}`;
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  });

  messageForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const message = messageInput.value;
    const fileInput = document.getElementById('file-input');
    const recipient = prompt("Enter the recipient's username:");
    
    if (recipient) {
      try {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          // Add file size check (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Please choose a file under 5MB.');
            return;
          }
          
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const fileData = {
              name: file.name,
              type: file.type,
              data: e.target.result
            };
            
            // Emit message with file
            socket.emit('private_message', {
              recipient,
              message,
              file: fileData
            });
            
            // Show sent message in UI
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'sent');
            
            // Add text message if present
            if (message) {
              const textDiv = document.createElement('div');
              textDiv.textContent = message;
              messageElement.appendChild(textDiv);
            }
            
            // Add file preview
            if (file.type.startsWith('image/')) {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.style.maxWidth = '200px';
              messageElement.appendChild(img);
            } else {
              const fileInfo = document.createElement('div');
              fileInfo.textContent = `Sent file: ${file.name}`;
              messageElement.appendChild(fileInfo);
            }
            
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          };
          
          reader.onerror = function(error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
          };
          
          reader.readAsDataURL(file);
        } else if (message) {
          // Send text-only message
          socket.emit('private_message', { recipient, message });
          
          // Show sent message in UI
          const messageElement = document.createElement('div');
          messageElement.classList.add('message', 'sent');
          messageElement.textContent = message;
          messagesDiv.appendChild(messageElement);
        }
        
        // Clear inputs
        messageInput.value = '';
        fileInput.value = '';
        
        // Scroll to bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
      }
    }
  });

  socket.on('new_message', function(data) {
    const { sender, message, file } = data;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'received');
    
    if (file) {
      // Add sender name
      const senderDiv = document.createElement('div');
      senderDiv.textContent = `${sender}:`;
      senderDiv.classList.add('message-sender');
      messageElement.appendChild(senderDiv);
      
      // Add text message if present
      if (message) {
        const textDiv = document.createElement('div');
        textDiv.textContent = message;
        messageElement.appendChild(textDiv);
      }
      
      // Handle file content
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = file.data;
        img.style.maxWidth = '200px';
        messageElement.appendChild(img);
      } else {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.textContent = `Download: ${file.name}`;
        messageElement.appendChild(link);
      }
    } else {
      messageElement.textContent = `${sender}: ${message}`;
    }
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('username');
    socket.disconnect();
    loginContainer.style.display = 'block';
    chatContainer.style.display = 'none';
    messagesDiv.innerHTML = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  });

  // Socket connection events
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    loginError.textContent = '';
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
    loginError.textContent = 'Disconnected from server. Please refresh the page.';
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    loginError.textContent = 'Connection error. Please try again later.';
  });
});

// Initialize Socket.IO connection with JWT in authentication
function initSocket() {
  socket = io({
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const msgEl = document.createElement('div');
    msgEl.innerText = `${data.user}: ${data.msg}`;
    messagesDiv.appendChild(msgEl);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

  socket.on('new_message', function(data) {
    const { sender, message } = data;
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    document.getElementById('messages').appendChild(messageElement);
  });
}

// Function to render navigation based on user role
function renderNavigation(userRole) {
    const normalizedRole = userRole ? userRole.trim().toUpperCase() : '';
    const navList = document.querySelector('#main-nav');
    
    if (!navList) {
        console.error('Navigation list element not found');
        return;
    }
    
    // Base navigation items (common for all roles)
    let navItems = [
        {
            href: '/dashboard',
            icon: 'fa-home',
            text: 'Dashboard'
        }
    ];

    // Role-specific navigation items
    if (normalizedRole === 'INVESTIGATION OFFICER' || normalizedRole === 'IO') {
        navItems = navItems.concat([
            {
                href: '/case-files',
                icon: 'fa-folder',
                text: 'Case Files'
            },
            {
                href: '/reports',
                icon: 'fa-file-alt',
                text: 'Reports'
            },
            {
                href: '/communication',
                icon: 'fa-comments',
                text: 'Communication',
                active: true // Mark as active since we're on the communication page
            }
        ]);
    } else if (normalizedRole === 'STATION HOUSE OFFICER' || normalizedRole === 'SHO') {
        navItems = navItems.concat([
            {
                href: '/case-management',
                icon: 'fa-tasks',
                text: 'Case Management'
            },
            {
                href: '/officer-management',
                icon: 'fa-users',
                text: 'Officer Management'
            },
            {
                href: '/communication',
                icon: 'fa-comments',
                text: 'Communication',
                active: true
            },
            {
                href: '/grievance',
                icon: 'fa-exclamation-circle',
                text: 'Grievance'
            }
        ]);
    }

    // Add settings for all roles
    navItems.push({
        href: '/settings',
        icon: 'fa-cog',
        text: 'Settings'
    });

    // Generate navigation HTML with enhanced styling
    navList.innerHTML = navItems.map(item => `
        <li class="${item.active ? 'active' : ''}">
            <a href="${item.href}" class="nav-link">
                <i class="fas ${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        </li>
    `).join('');
}
