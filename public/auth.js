/**
 * Authentication Handler
 * Handles form submission, validation, and API calls for signup and login
 */

const API_BASE_URL = '/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_PROFILE_KEY = 'user_profile';

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}

/**
 * Validate password length
 */
function isValidPassword(password) {
    return password && password.length >= 6;
}

/**
 * Validate full name
 */
function isValidFullName(name) {
    return name && name.trim().length >= 2;
}

/**
 * Clear all error messages on the form
 */
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });

    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Show validation error for a specific field
 */
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    if (inputElement) {
        inputElement.classList.add('error');
    }
}

/**
 * Show alert error message
 */
function showAlertError(message) {
    const alertElement = document.getElementById('alertError');
    if (alertElement) {
        alertElement.textContent = message;
        alertElement.classList.add('show');
    }
}

/**
 * Clear alert error message
 */
function clearAlertError() {
    const alertElement = document.getElementById('alertError');
    if (alertElement) {
        alertElement.classList.remove('show');
        alertElement.textContent = '';
    }
}

/**
 * Show loading state on submit button
 */
function setLoadingState(isLoading) {
    const button = document.querySelector('button[type="submit"]');
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');

    if (button) {
        button.disabled = isLoading;
    }

    if (spinner) {
        if (isLoading) {
            spinner.classList.add('show');
        } else {
            spinner.classList.remove('show');
        }
    }
}

/**
 * Store token and user profile in localStorage
 */
function storeAuthData(token, userProfile) {
    try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
        return true;
    } catch (error) {
        console.error('Error storing auth data:', error);
        return false;
    }
}

/**
 * Retrieve stored token from localStorage
 */
function getStoredToken() {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
}

/**
 * Retrieve stored user profile from localStorage
 */
function getStoredUserProfile() {
    try {
        const profileStr = localStorage.getItem(USER_PROFILE_KEY);
        return profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return null;
    }
}

/**
 * Clear authentication data from localStorage
 */
function clearAuthData() {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup(form) {
    clearErrors();
    clearAlertError();
    setLoadingState(true);

    try {
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Validation
        let hasErrors = false;

        if (!isValidFullName(fullName)) {
            showError('fullName', 'Full name must be at least 2 characters');
            hasErrors = true;
        }

        if (!email) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (!password) {
            showError('password', 'Password is required');
            hasErrors = true;
        } else if (!isValidPassword(password)) {
            showError('password', 'Password must be at least 6 characters');
            hasErrors = true;
        }

        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            hasErrors = true;
        }

        if (!terms) {
            showAlertError('Please agree to the terms and conditions');
            hasErrors = true;
        }

        if (hasErrors) {
            setLoadingState(false);
            return;
        }

        // API request
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                password: password
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error(`Server returned invalid response (Status: ${response.status}). Please make sure the backend server is running.`);
        }

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Store token and user profile
        if (data.token && data.user) {
            storeAuthData(data.token, data.user);

            // Show success message
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.classList.add('show');
            }

            // Redirect to target page after 2 seconds
            setTimeout(() => {
                const params = new URLSearchParams(window.location.search);
                const redirectPage = params.get('redirect') || 'profile.html';
                window.location.href = redirectPage;
            }, 2000);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlertError(error.message || 'An error occurred during signup');
        setLoadingState(false);
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(form) {
    clearErrors();
    clearAlertError();
    setLoadingState(true);

    try {
        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        let hasErrors = false;

        if (!email) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (!password) {
            showError('password', 'Password is required');
            hasErrors = true;
        }

        if (hasErrors) {
            setLoadingState(false);
            return;
        }

        // API request
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error(`Server returned invalid response (Status: ${response.status}). Please make sure the backend server is running.`);
        }

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user profile
        if (data.token && data.user) {
            storeAuthData(data.token, data.user);

            // Redirect to target page
            const params = new URLSearchParams(window.location.search);
            const redirectPage = params.get('redirect') || 'profile.html';
            window.location.href = redirectPage;
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlertError(error.message || 'An error occurred during login');
        setLoadingState(false);
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getStoredToken();
}

/**
 * Get the current user profile
 */
function getCurrentUser() {
    return getStoredUserProfile();
}

/**
 * Logout user
 */
function logout() {
    clearAuthData();
    window.location.href = 'login.html';
}

/**
 * Initialize auth state on page load
 * Redirect to login if accessing protected pages without auth
 */
function initializeAuth() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const protectedPages = ['profile.html'];

    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', initializeAuth);
