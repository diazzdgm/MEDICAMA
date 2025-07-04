// ===== FORM HANDLING ===== //

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initFormAnimations();
});

// ===== CONTACT FORM INITIALIZATION ===== //
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldErrors);
        });
        
        // Add character counter for textarea
        const textarea = contactForm.querySelector('textarea');
        if (textarea) {
            addCharacterCounter(textarea);
        }
        
        // Add phone number formatting
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneInput);
        }
    }
}

// ===== FORM SUBMISSION HANDLER ===== //
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.form-submit');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(submitButton, btnText, btnLoading, true);
    
    try {
        // Collect form data
        const formData = collectFormData(form);
        
        // Simulate API call (replace with your actual endpoint)
        const response = await submitFormData(formData);
        
        if (response.success) {
            showSuccessMessage(form);
            resetForm(form);
            
            // Track conversion (if you have analytics)
            trackFormSubmission('contact_form', formData);
            
            // Redirect to thank you page (optional)
            // window.location.href = '/gracias.html';
        } else {
            throw new Error(response.message || 'Error al enviar el formulario');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        setLoadingState(submitButton, btnText, btnLoading, false);
    }
}

// ===== FORM DATA COLLECTION ===== //
function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Add metadata
    data.timestamp = new Date().toISOString();
    data.source = 'website_contact_form';
    data.page_url = window.location.href;
    data.user_agent = navigator.userAgent;
    
    return data;
}

// ===== FORM SUBMISSION API ===== //
async function submitFormData(data) {
    // Replace this with your actual API endpoint
    const API_ENDPOINT = '/api/contact'; // or your service endpoint
    
    // For demo purposes, simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true, message: 'Formulario enviado correctamente' });
        }, 2000);
    });
    
    // Uncomment and modify for real API call:
    /*
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    */
}

// ===== FORM VALIDATION ===== //
function initFormValidation() {
    // Custom validation messages in Spanish
    const validationMessages = {
        required: 'Este campo es obligatorio',
        email: 'Por favor, introduce un email válido',
        phone: 'Por favor, introduce un teléfono válido',
        minLength: 'Este campo debe tener al menos {min} caracteres',
        maxLength: 'Este campo no puede tener más de {max} caracteres'
    };
    
    window.validationMessages = validationMessages;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors(form);
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // Clear previous errors
    clearFieldErrors({ target: input });
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (required && !value) {
        errorMessage = 'Este campo es obligatorio';
        isValid = false;
    }
    
    // Type-specific validation
    if (value && isValid) {
        switch (type) {
            case 'email':
                if (!isValidEmail(value)) {
                    errorMessage = 'Por favor, introduce un email válido';
                    isValid = false;
                }
                break;
                
            case 'tel':
                if (!isValidPhone(value)) {
                    errorMessage = 'Por favor, introduce un teléfono válido';
                    isValid = false;
                }
                break;
                
            case 'text':
                if (input.name === 'name' && value.length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;
        }
        
        // Textarea validation
        if (input.tagName === 'TEXTAREA') {
            if (value.length < 10) {
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                isValid = false;
            }
        }
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(input, errorMessage);
    }
    
    return isValid;
}

// ===== ERROR HANDLING ===== //
function showFieldError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    input.parentNode.appendChild(errorElement);
    
    // Add error styles to input
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

function clearFieldErrors(e) {
    const input = e.target;
    input.classList.remove('error');
    
    // Remove error message
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Reset input styles
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

function clearAllErrors(form) {
    const errorInputs = form.querySelectorAll('.form-input.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorInputs.forEach(input => {
        input.classList.remove('error');
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
    
    errorMessages.forEach(message => message.remove());
}

// ===== UTILITY FUNCTIONS ===== //
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Mexican phone number should have 10 digits
    return cleaned.length >= 10 && cleaned.length <= 12;
}

function formatPhoneInput(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    // Format as +52 XXX XXX XXXX
    if (value.length >= 2) {
        if (value.startsWith('52')) {
            value = value.substring(2);
        }
        
        if (value.length > 0) {
            value = value.match(/.{1,3}/g).join(' ');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            input.value = '+52 ' + value;
        }
    }
}

function addCharacterCounter(textarea) {
    const maxLength = 500;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: right;
        margin-top: 5px;
    `;
    
    function updateCounter() {
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = '#666';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counter);
    updateCounter();
}

// ===== UI STATE MANAGEMENT ===== //
function setLoadingState(button, textElement, loadingElement, isLoading) {
    if (isLoading) {
        button.disabled = true;
        textElement.style.display = 'none';
        loadingElement.style.display = 'inline-flex';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        textElement.style.display = 'inline';
        loadingElement.style.display = 'none';
        button.classList.remove('loading');
    }
}

function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: #22c55e;
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
            animation: fadeIn 0.5s ease;
        ">
            <i class="fas fa-check-circle" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
            <strong>¡Solicitud enviada correctamente!</strong><br>
            Nos pondremos en contacto contigo muy pronto.
        </div>
    `;
    
    form.insertBefore(successMessage, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
    
    // Show notification
    showNotification('¡Solicitud enviada correctamente!', 'success');
}

function resetForm(form) {
    form.reset();
    clearAllErrors(form);
    
    // Reset character counter if exists
    const counter = form.querySelector('.character-counter');
    if (counter) {
        counter.textContent = '0/500';
        counter.style.color = '#666';
    }
}

// ===== FORM ANIMATIONS ===== //
function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Add focus animations
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
}

// ===== ANALYTICS TRACKING ===== //
function trackFormSubmission(formName, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'form_name': formName,
            'value': 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    // Custom analytics
    console.log('Form submission tracked:', formName, data);
}

// ===== AUTO-SAVE FUNCTIONALITY ===== //
function initAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-input');
    const STORAGE_KEY = 'contact_form_data';
    
    // Load saved data
    loadSavedData();
    
    // Auto-save on input
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    function saveFormData() {
        const data = {};
        inputs.forEach(input => {
            if (input.value.trim()) {
                data[input.name] = input.value;
            }
        });
        
        if (Object.keys(data).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }
    
    function loadSavedData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                inputs.forEach(input => {
                    if (data[input.name]) {
                        input.value = data[input.name];
                        input.parentNode.classList.add('focused');
                    }
                });
            } catch (e) {
                console.error('Error loading saved form data:', e);
            }
        }
    }
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem(STORAGE_KEY);
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initAutoSave);

// Debounce function (if not already available)
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Show notification function (if not already available)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background-color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}