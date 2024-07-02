const registeredUsers = new Map();
const loggedInUsers = new Map();

function validateName(name) {
    return /^[A-Za-z]+$/.test(name);
}

function validatePassword(password) {
    const strength = {
        1: 'Weak',
        2: 'Mid',
        3: 'Strong'
    };
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password) && /\W/.test(password)) score++;

    return strength[score] || 'Weak';
}

function validateMobileNumber(mobile) {
    return /^\d{11}$/.test(mobile);
}

function isEmailRegistered(email) {
    return registeredUsers.has(email);
}

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

document.getElementById('signUpForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobile = document.getElementById('mobile').value;
    const birthdate = document.getElementById('birthdate').value;
    const messageElement = document.getElementById('signUpMessage');
    
    if (!validateName(firstName)) {
        messageElement.textContent = 'First name must be a string.';
        return;
    }

    const passwordStrength = validatePassword(password);
    if (passwordStrength === 'Weak') {
        messageElement.textContent = 'Password is too weak.';
        return;
    }

    if (!validateMobileNumber(mobile)) {
        messageElement.textContent = 'Mobile number must contain 11 digits.';
        return;
    }

    if (isEmailRegistered(email)) {
        messageElement.textContent = 'Email is already registered.';
        return;
    }

    const age = calculateAge(birthdate);
    registeredUsers.set(email, { firstName, lastName, password, mobile, birthdate });

    messageElement.textContent = `Successfully signed up! Redirecting to login...`;
    messageElement.style.color = 'green';
    
    console.log('Sign Up Form Data:', { firstName, lastName, email, password, mobile, birthdate, age });
    
    setTimeout(() => {
        window.location.href = 'login.html'; 
    }, 2000); 
});

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    if (!isEmailRegistered(email)) {
        messageElement.textContent = 'Email not registered.';
        return;
    }

    if (loggedInUsers.has(email)) {
        messageElement.textContent = 'Already logged in successfully!';
        messageElement.style.color = 'green';
        return;
    }

    const user = registeredUsers.get(email);
    if (user.password !== password) {
        messageElement.textContent = 'Incorrect password.';
        return;
    }

    loggedInUsers.set(email, true);
    messageElement.textContent = 'Login successful!';
    messageElement.style.color = 'green';
    
    console.log('Login Form Data:', { email, password });
});

document.getElementById('password')?.addEventListener('input', function(event) {
    const passwordStrengthElement = document.getElementById('passwordStrength');
    const password = event.target.value;
    const strength = validatePassword(password);
    passwordStrengthElement.textContent = `Password Strength: ${strength}`;
});
