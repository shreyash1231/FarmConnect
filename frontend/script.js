// Global variables
let userData = {};
let userType = '';

// Open signup modal
function openSignup(role) {
  userType = role;
  // Set the modal title and show it
  document.getElementById('signup-role').textContent = role;
  document.getElementById('signup-modal').style.display = 'flex';

  // Show farmer-fields only for farmers, in flex layout
  const farmerFields = document.getElementById('farmer-fields');
  if (role === 'farmer') {
    farmerFields.style.display = 'flex';
  } else {
    farmerFields.style.display = 'none';
  }
}

// Close signup modal
function closeSignup() {
    document.getElementById('signup-modal').style.display = 'none';
}

// Open OTP modal
function openOTP() {
    document.getElementById('otp-modal').style.display = 'flex';
}

// Close OTP modal
function closeOTP() {
    document.getElementById('otp-modal').style.display = 'none';
}



// Signup function with token handling for both main backend and chat service
async function signup() {
    const pwd = document.getElementById('password').value;

    // Enforce password length
    if (pwd.length <= 6) {
        alert('Password must be more than 6 characters');
        return;
    }

    // Collect main user data
    userData = {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        gender: document.getElementById('gender').value,
        password: pwd,
        mobileNumber: document.getElementById('mobileNumber').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        userType: userType
    };

    // Collect chat signup data
    chatsignup = {
        fullName: document.getElementById('name').value,
        username: document.getElementById('username').value,
        password: pwd,
        confirmPassword: pwd,
        gender: document.getElementById('gender').value
    };

    if (userType === 'farmer') {
        userData.landOwnedAcres = parseFloat(document.getElementById('landOwnedAcres').value);
        userData.upiId = document.getElementById('upiid').value;
    }

    try {
        // Signup on main backend
        const response = await fetch('http://127.0.0.1:8080/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Signup failed on main backend');

        // Signup on chat backend
        const chatResponse = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatsignup)
        });
        if (!chatResponse.ok) throw new Error('Signup failed on chat backend');

        closeSignup();
        openOTP();
    } catch (error) {
        alert(error.message);
    }
}

// OTP verification
async function verifyOTP() {
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userData.email, otp, userType: userData.userType })
        });

        if (!response.ok) throw new Error('OTP verification failed');
        closeOTP();
        alert('OTP verified! Please login.');
    } catch (error) {
        alert(error.message);
    }
}

// Login function with token handling for both main backend and chat service
async function login() {
    const loginData = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };

    try {
        // First: Login to main backend
        const response = await fetch('http://127.0.0.1:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed on main backend');
        }

        const data = await response.json();
        console.log('Main backend login response:', data); // Debugging

        // Store main backend token and userType in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('farmerId', data.farmerId);


        if (data.userType.toLowerCase() === 'farmer') {
            console.log('Redirecting to farmer_dashboard.html...');
            window.location.href = 'farmer_dashboard.html';
        } else if (data.userType.toLowerCase() === 'customer') {
            console.log('Redirecting to consumer_dashboard.html...');
            window.location.href = 'consumer_dashboard.html';
        } else {
            throw new Error('Invalid user type');
        }

    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
    }
}
