
document.addEventListener('DOMContentLoaded', () => {
    initializeRoleSelection();
    initializeFormValidation();
    initializeFileUploads();
});

function initializeRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            window.location.href = `SignUp.php?role=${role}`;
        });
    });
}

function initializeFormValidation() {
    const form = document.querySelector('.signup-form');
    if (!form) return;

    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

    
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showError('Please correct the errors in the form.');
            return;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('../controller/signup.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            if (result.includes('success')) {
                showSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '../index.php';
                }, 2000);
            } else {
                showError(result);
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    });
}

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    clearError(input);


    if (input.required && !value) {
        showFieldError(input, `${fieldName} is required`);
        return false;
    }

    switch (fieldName) {
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(input, 'Please enter a valid email address');
                return false;
            }
            break;

        case 'contacts':
            if (!isValidPhone(value)) {
                showFieldError(input, 'Please enter a valid phone number');
                return false;
            }
            break;

        case 'password':
            if (value.length < 8) {
                showFieldError(input, 'Password must be at least 8 characters long');
                return false;
            }
            break;

        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showFieldError(input, 'Passwords do not match');
                return false;
            }
            break;
    }

    return true;
}

function initializeFileUploads() {
    // Profile photo preview
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePreview');
    
    if (profilePhotoInput && profilePreview) {
        profilePhotoInput.addEventListener('change', function(e) {
            handleFileUpload(e.target.files[0], profilePreview, {
                maxSize: 5 * 1024 * 1024, // 5MB
                allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
            });
        });
    }

    // License picture preview 
    const licenseInput = document.getElementById('licensePicture');
    if (licenseInput) {
        licenseInput.addEventListener('change', function(e) {
            // Create a preview element if it doesn't exist
            let licensePreview = document.getElementById('licensePreview');
            if (!licensePreview) {
                licensePreview = document.createElement('div');
                licensePreview.id = 'licensePreview';
                licensePreview.className = 'license-preview';
                licenseInput.parentElement.appendChild(licensePreview);
            }

            handleFileUpload(e.target.files[0], licensePreview, {
                maxSize: 5 * 1024 * 1024, // 5MB
                allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
            });
        });
    }
}

function handleFileUpload(file, previewElement, options) {
    if (!file) return;

    // Validate file type
    if (!options.allowedTypes.includes(file.type)) {
        showError('Please upload an image file (JPEG, PNG, or GIF)');
        return;
    }

    // Validate file size
    if (file.size > options.maxSize) {
        showError('File size must be less than 5MB');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

function showFieldError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    input.classList.add('error');
    input.parentElement.appendChild(errorDiv);
}

function clearError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.querySelector('.signup-form');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const form = document.querySelector('.signup-form');
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    form.insertBefore(successDiv, form.firstChild);
}