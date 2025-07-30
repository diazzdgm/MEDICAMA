/* ===================================
   MEDICAMA - MANEJO DE FORMULARIOS
   =================================== */

// Variables para el manejo de formularios
let formSubmissionInProgress = false;

// Inicializar manejo de formularios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initPriceCalculator();
    
    console.log('Form Handler - Inicializado correctamente');
});

/* ===================================
   FORMULARIO DE CONTACTO
   =================================== */

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Agregar validación en tiempo real
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (formSubmissionInProgress) {
        return;
    }
    
    const form = e.target;
    const submitButton = form.querySelector('.form-submit');
    const originalButtonText = submitButton.textContent;
    
    // Validar formulario completo
    if (!validateForm(form)) {
        showNotification('Por favor, corrige los errores en el formulario.', 'error');
        return;
    }
    
    // Iniciar estado de carga
    formSubmissionInProgress = true;
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    submitButton.textContent = 'Enviando...';
    
    try {
        // Recopilar datos del formulario
        const formData = collectFormData(form);
        
        // Simular envío (aquí integrarías con tu backend)
        const response = await simulateFormSubmission(formData);
        
        if (response.success) {
            handleSuccessfulSubmission(form, formData);
        } else {
            throw new Error(response.message || 'Error al enviar el formulario');
        }
        
    } catch (error) {
        console.error('Error en envío de formulario:', error);
        handleFormError(error.message);
    } finally {
        // Restaurar estado del botón
        formSubmissionInProgress = false;
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        submitButton.textContent = originalButtonText;
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Agregar datos adicionales
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.page = window.location.href;
    
    return data;
}

async function simulateFormSubmission(data) {
    try {
        // Intentar enviar por EmailJS primero
        if (typeof emailjs !== 'undefined') {
            const response = await sendToEmail(data);
            
            // CONVERSIÓN GOOGLE ADS - Envío de Formulario
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-17307747467/_YuOCJf9xfEaEIuJ_bxA',
                    'value': 50.0,
                    'currency': 'MXN'
                });
                
                // Evento adicional para Google Analytics
                gtag('event', 'conversion', {
                    'send_to': 'G-FQ23LQ1DG1',
                    'event_category': 'Formulario',
                    'event_label': 'Cotización Enviada',
                    'value': 1
                });
                
                // Evento personalizado para leads
                gtag('event', 'generate_lead', {
                    'event_category': 'Lead Generation',
                    'event_label': 'Formulario Contacto',
                    'value': 1
                });
            }
            
            return {
                success: true,
                message: 'Cotización enviada correctamente'
            };
        } else {
            console.warn('EmailJS no está cargado, modo simulación activado');
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
                success: true,
                message: 'Formulario enviado correctamente (modo simulación)'
            };
        }
    } catch (error) {
        console.error('Error enviando formulario:', error);
        throw new Error('Error al enviar la cotización. Por favor, intenta nuevamente.');
    }
}

function handleSuccessfulSubmission(form, data) {
    // Mostrar mensaje de éxito
    const successMessage = `¡Gracias ${data.nombre}! Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo al ${data.telefono} en las próximas 2 horas.`;
    
    showNotification(successMessage, 'success', 8000);
    
    // Limpiar formulario
    form.reset();
    
    // Ocultar estimación de precio
    const priceEstimate = document.getElementById('price-estimate');
    if (priceEstimate) {
        priceEstimate.style.display = 'none';
    }
    
    // Scroll suave al inicio del formulario
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Enviar evento de conversión (para analytics)
    sendConversionEvent(data);
    
    // Opcional: Redireccionar a página de confirmación
    // setTimeout(() => {
    //     window.location.href = '/gracias.html';
    // }, 3000);
}

function handleFormError(errorMessage) {
    showNotification(
        `Error al enviar el formulario: ${errorMessage}. Por favor, inténtalo de nuevo o contáctanos directamente.`,
        'error',
        8000
    );
}

/* ===================================
   VALIDACIÓN DE FORMULARIOS
   =================================== */

function initFormValidation() {
    // Configurar validaciones personalizadas
    setupCustomValidations();
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('.form-input[required]');
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Limpiar errores previos
    clearFieldError({ target: field });
    
    let isValid = true;
    let errorMessage = '';
    
    // Validación de campos requeridos
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio.';
    }
    // Validación de email
    else if (fieldName === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Por favor, ingresa un email válido.';
    }
    // Validación de teléfono
    else if (fieldName === 'telefono' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Por favor, ingresa un teléfono válido (10 dígitos).';
    }
    // Validación de nombre (solo letras y espacios)
    else if (fieldName === 'nombre' && value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        isValid = false;
        errorMessage = 'El nombre solo puede contener letras y espacios.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensaje de error previo
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear y mostrar nuevo mensaje de error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function setupCustomValidations() {
    // Validación de teléfono en tiempo real
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            
            // Formatear teléfono mexicano
            if (value.length >= 10) {
                value = value.substring(0, 10);
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
            }
            
            e.target.value = value;
        });
    }
    
    // Formateo automático de nombre (capitalizar)
    const nameInput = document.getElementById('nombre');
    if (nameInput) {
        nameInput.addEventListener('blur', function(e) {
            const words = e.target.value.toLowerCase().split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            );
            e.target.value = capitalizedWords.join(' ');
        });
    }
}

/* ===================================
   CALCULADORA DE PRECIOS
   =================================== */

function initPriceCalculator() {
    const tipoCamaSelect = document.getElementById('tipo-cama');
    const duracionSelect = document.getElementById('duracion');
    
    if (tipoCamaSelect && duracionSelect) {
        tipoCamaSelect.addEventListener('change', calculatePrice);
        duracionSelect.addEventListener('change', calculatePrice);
    }
}

// La función calculatePrice ya está definida en main.js
// pero aquí agregamos funcionalidad adicional

function updatePriceDisplay(tipoCama, duracion, precioInfo) {
    const priceEstimate = document.getElementById('price-estimate');
    const estimatedPrice = document.getElementById('estimated-price');
    
    if (!priceEstimate || !estimatedPrice) return;
    
    if (tipoCama && duracion && precioInfo.total > 0) {
        estimatedPrice.innerHTML = `
            <div class="price-breakdown">
                <div class="price-main">
                    $${precioInfo.total.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} MXN
                </div>
                <div class="price-details">
                    <small>
                        $${precioInfo.promedio.toLocaleString('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}/día por ${precioInfo.dias} días
                        ${precioInfo.descuentoTexto}
                    </small>
                </div>
                <div class="price-note">
                    <small>*Precio estimado. Incluye entrega, instalación y mantenimiento.</small>
                </div>
            </div>
        `;
        
        priceEstimate.style.display = 'block';
        
        // Animación de entrada
        priceEstimate.style.opacity = '0';
        priceEstimate.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            priceEstimate.style.transition = 'all 0.3s ease';
            priceEstimate.style.opacity = '1';
            priceEstimate.style.transform = 'translateY(0)';
        }, 100);
        
    } else {
        priceEstimate.style.display = 'none';
    }
}

/* ===================================
   AUTOCOMPLETADO Y SUGERENCIAS
   =================================== */

function initAddressAutocomplete() {
    const addressInput = document.getElementById('direccion');
    
    if (addressInput && typeof google !== 'undefined' && google.maps && google.maps.places) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'],
            componentRestrictions: { country: 'mx' },
            fields: ['formatted_address', 'geometry', 'address_components']
        });
        
        autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                addressInput.value = place.formatted_address;
            }
        });
    }
}

/* ===================================
   ALMACENAMIENTO LOCAL (BORRADOR)
   =================================== */

function initFormDraft() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const DRAFT_KEY = 'medirent_form_draft';
    
    // Cargar borrador al inicializar
    loadFormDraft();
    
    // Guardar borrador cada vez que cambie un campo
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormDraft, 1000));
    });
    
    // Limpiar borrador al enviar exitosamente
    form.addEventListener('submit', function() {
        clearFormDraft();
    });
}

function saveFormDraft() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = {};
    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        if (input.value.trim()) {
            formData[input.name] = input.value;
        }
    });
    
    if (Object.keys(formData).length > 0) {
        try {
            localStorage.setItem('medirent_form_draft', JSON.stringify(formData));
        } catch (e) {
            console.warn('No se pudo guardar el borrador del formulario');
        }
    }
}

function loadFormDraft() {
    try {
        const draftData = localStorage.getItem('medirent_form_draft');
        if (draftData) {
            const formData = JSON.parse(draftData);
            
            Object.keys(formData).forEach(fieldName => {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field && formData[fieldName]) {
                    field.value = formData[fieldName];
                    
                    // Disparar evento change para recalcular precios si es necesario
                    if (fieldName === 'tipo-cama' || fieldName === 'duracion') {
                        calculatePrice();
                    }
                }
            });
            
            // Mostrar notificación de borrador recuperado
            showNotification('Se recuperó un borrador de tu formulario', 'info', 3000);
        }
    } catch (e) {
        console.warn('No se pudo cargar el borrador del formulario');
    }
}

function clearFormDraft() {
    try {
        localStorage.removeItem('medirent_form_draft');
    } catch (e) {
        console.warn('No se pudo limpiar el borrador del formulario');
    }
}

/* ===================================
   ANALYTICS Y TRACKING
   =================================== */

function sendConversionEvent(formData) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: 'quote_request',
            value: 1,
            custom_parameters: {
                bed_type: formData['tipo-cama'],
                duration: formData.duracion,
                location: formData.direccion
            }
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_category: 'medical_equipment',
            content_name: formData['tipo-cama'],
            value: 1,
            currency: 'MXN'
        });
    }
    
    // Evento personalizado
    const customEvent = new CustomEvent('medirente_conversion', {
        detail: {
            type: 'quote_request',
            data: formData,
            timestamp: new Date().toISOString()
        }
    });
    
    window.dispatchEvent(customEvent);
}

function trackFormInteraction(action, field = null) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_interaction', {
            event_category: 'engagement',
            event_label: action,
            custom_parameters: {
                field: field,
                page: window.location.pathname
            }
        });
    }
}

/* ===================================
   VALIDACIONES AVANZADAS
   =================================== */

function validateBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = domingo, 6 = sábado
    
    // Horario de atención: Lunes a Viernes 8am-8pm, Sábados 9am-6pm
    const isBusinessDay = day >= 1 && day <= 6;
    const isBusinessHour = (day >= 1 && day <= 5 && hour >= 8 && hour < 20) || 
                          (day === 6 && hour >= 9 && hour < 18);
    
    if (!isBusinessDay || !isBusinessHour) {
        const message = day === 0 ? 
            'Los domingos no tenemos servicio. Te contactaremos el lunes.' :
            'Fuera del horario de atención. Te contactaremos en el próximo horario hábil.';
            
        showNotification(message, 'info', 6000);
    }
    
    return { isBusinessDay, isBusinessHour };
}

function validateServiceArea(address) {
    // Lista de códigos postales de servicio (ejemplo)
    const serviceAreas = [
        // CDMX
        /^0[1-9]\d{3}$/,  // 01000-09999
        /^1[0-6]\d{3}$/,  // 10000-16999
        
        // Estado de México (área metropolitana)
        /^5[2-7]\d{3}$/,  // 52000-57999
        /^53\d{3}$/       // 53000-53999
    ];
    
    // Extraer código postal de la dirección
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    
    if (postalCodeMatch) {
        const postalCode = postalCodeMatch[0];
        const isInServiceArea = serviceAreas.some(pattern => pattern.test(postalCode));
        
        if (!isInServiceArea) {
            showNotification(
                'El código postal ingresado podría estar fuera de nuestra área de servicio. Te contactaremos para confirmar disponibilidad.',
                'warning',
                8000
            );
        }
        
        return isInServiceArea;
    }
    
    return true; // Si no se puede determinar, asumir que sí está en el área
}

/* ===================================
   INTEGRACIÓN CON SERVICIOS EXTERNOS
   =================================== */

async function sendToWebhook(formData) {
    const webhookUrl = 'YOUR_WEBHOOK_URL'; // Configurar en producción
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                source: 'website',
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error enviando a webhook:', error);
        throw error;
    }
}

async function sendToEmail(formData) {
    // Configuración EmailJS para MEDICAMA
    const SERVICE_ID = 'service_hy7j13g';        // ServiceID configurado
    const TEMPLATE_ID = 'template_gnu6kb9';      // TemplateID configurado  
    const PUBLIC_KEY = 'X7THsPodFCb8DzpnS';      // Public Key configurado
    
    const emailData = {
        to_email: 'info@camadehospital.mx',
        from_name: formData.nombre,
        customer_phone: formData.telefono,
        duration: formData.duracion,
        floors: formData.pisos,
        address: formData.direccion,
        message: formData.mensaje,
        timestamp: new Date().toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        source: 'Sitio Web MEDICAMA'
    };
    
    // Envío con EmailJS
    if (typeof emailjs !== 'undefined') {
        try {
            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, PUBLIC_KEY);
            console.log('Email enviado exitosamente:', response);
            return { success: true };
        } catch (error) {
            console.error('Error enviando email:', error);
            throw error;
        }
    }
    
    return { success: true };
}

/* ===================================
   MANEJO DE TESTIMONIOS
   =================================== */

async function handleTestimonialSubmission(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.target;
    const submitBtn = document.getElementById('submit-testimonial');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('testimonial-success');
    const errorMessage = document.getElementById('testimonial-error');
    
    // Ocultar mensajes previos
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Obtener datos del formulario
    const formData = {
        nombre: form.name.value.trim(),
        ubicacion: form.location.value.trim(),
        calificacion: form.rating.value,
        mensaje: form.message.value.trim(),
        consent: form.consent.checked
    };
    
    // Debug: mostrar datos del formulario
    console.log('Datos del formulario testimonio:', formData);
    
    // Validación detallada
    let testimonialErrorMessage = '';
    
    if (!formData.nombre) {
        testimonialErrorMessage = 'Por favor, ingresa tu nombre completo.';
    } else if (!formData.ubicacion) {
        testimonialErrorMessage = 'Por favor, ingresa tu ubicación.';
    } else if (!formData.calificacion) {
        testimonialErrorMessage = 'Por favor, selecciona una calificación con las estrellas.';
    } else if (!formData.mensaje) {
        testimonialErrorMessage = 'Por favor, escribe tu experiencia.';
    } else if (!formData.consent) {
        testimonialErrorMessage = 'Debes autorizar el uso de tu testimonio para continuar.';
    }
    
    if (testimonialErrorMessage) {
        console.log('Validación fallida:', {
            nombre: !!formData.nombre,
            ubicacion: !!formData.ubicacion,
            calificacion: !!formData.calificacion,
            mensaje: !!formData.mensaje,
            consent: !!formData.consent
        });
        showTestimonialError(testimonialErrorMessage);
        return;
    }
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        const result = await sendTestimonialEmail(formData);
        
        if (result.success) {
            // Éxito
            form.reset();
            successMessage.style.display = 'block';
            
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'testimonial_submission', {
                    event_category: 'engagement',
                    event_label: 'testimonial_form',
                    value: parseInt(formData.calificacion)
                });
            }
            
            // Scroll al mensaje de éxito
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            showTestimonialError(result.error || 'Error al enviar el testimonio.');
        }
    } catch (error) {
        console.error('Error en envío de testimonio:', error);
        showTestimonialError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function sendTestimonialEmail(formData) {
    // Configuración EmailJS para MEDICAMA
    const SERVICE_ID = 'service_hy7j13g';        // ServiceID configurado
    const TEMPLATE_ID = 'template_gnu6kb9';      // Usar template existente
    const PUBLIC_KEY = 'X7THsPodFCb8DzpnS';      // Public Key configurado
    
    // Generar estrellas basadas en calificación
    const stars = '⭐'.repeat(parseInt(formData.calificacion));
    
    // Formatear datos para el template existente
    const emailData = {
        to_email: 'info@camadehospital.mx',
        from_name: formData.nombre,
        customer_phone: 'No proporcionado',
        duration: 'Testimonio',
        floors: formData.ubicacion,
        address: `Calificación: ${stars} (${formData.calificacion}/5)`,
        message: `TESTIMONIO DEL CLIENTE:\n\n${formData.mensaje}\n\nCalificación: ${stars} (${formData.calificacion}/5)\nUbicación: ${formData.ubicacion}`,
        timestamp: new Date().toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        source: 'Testimonio - Sitio Web MEDICAMA'
    };
    
    // Envío con EmailJS
    if (typeof emailjs !== 'undefined') {
        try {
            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, PUBLIC_KEY);
            console.log('Testimonio enviado exitosamente:', response);
            return { success: true };
        } catch (error) {
            console.error('Error EmailJS testimonio:', error);
            return { success: false, error: 'Error al enviar por email' };
        }
    } else {
        console.warn('EmailJS no está cargado para testimonios');
        return { success: false, error: 'Servicio de email no disponible' };
    }
}

function showTestimonialError(message) {
    const errorMessage = document.getElementById('testimonial-error');
    const errorText = errorMessage.querySelector('p');
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Inicializar manejo de testimonios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Buscando formulario de testimonios...');
    const testimonialForm = document.getElementById('testimonial-form');
    
    if (testimonialForm) {
        console.log('Formulario de testimonios encontrado - Inicializando...');
        testimonialForm.addEventListener('submit', handleTestimonialSubmission);
        initializeStarRating();
    } else {
        console.log('ERROR: Formulario de testimonios NO encontrado');
    }
});

// Inicializar funcionalidad de calificación por estrellas
function initializeStarRating() {
    console.log('=== INICIANDO initializeStarRating ===');
    
    const stars = document.querySelectorAll('.rating-input .star');
    const ratingText = document.querySelector('.rating-text');
    const ratingDescription = document.querySelector('.rating-description');
    
    console.log('Stars encontradas:', stars.length);
    console.log('Rating text elemento:', ratingText);
    console.log('Rating description elemento:', ratingDescription);
    
    if (stars.length === 0) {
        console.error('NO SE ENCONTRARON ESTRELLAS - Verificando selectores...');
        console.log('Formulario testimonios:', document.getElementById('testimonial-form'));
        console.log('Rating input:', document.querySelector('.rating-input'));
        console.log('Todos los elementos star:', document.querySelectorAll('.star'));
        return;
    }
    
    const ratingLabels = {
        1: { text: '1 estrella seleccionada', desc: 'Muy insatisfecho - El servicio no cumplió las expectativas' },
        2: { text: '2 estrellas seleccionadas', desc: 'Insatisfecho - El servicio tuvo varios problemas' },
        3: { text: '3 estrellas seleccionadas', desc: 'Neutral - El servicio fue aceptable' },
        4: { text: '4 estrellas seleccionadas', desc: 'Satisfecho - Buen servicio, lo recomendaría' },
        5: { text: '5 estrellas seleccionadas', desc: 'Muy satisfecho - Excelente servicio, superó las expectativas' }
    };
    
    let currentRating = 0;
    
    console.log('Inicializando star rating. Stars encontradas:', stars.length);
    
    // Agregar eventos a cada estrella
    stars.forEach((star, index) => {
        const rating = parseInt(star.dataset.rating);
        console.log(`Configurando estrella ${rating}`);
        
        // Click event - PRINCIPAL
        star.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`Estrella ${rating} clickeada`);
            currentRating = rating;
            
            // Marcar el radio button
            const radioButton = document.getElementById(`star${rating}`);
            if (radioButton) {
                radioButton.checked = true;
                console.log(`Radio button star${rating} marcado`);
            }
            
            // Actualizar visualización
            updateStarsDisplay(rating);
            
            // Actualizar texto
            if (ratingLabels[rating]) {
                ratingText.textContent = ratingLabels[rating].text;
                ratingText.classList.add('selected');
                ratingDescription.textContent = ratingLabels[rating].desc;
                ratingDescription.classList.add('show');
            }
        });
        
        // Hover events
        star.addEventListener('mouseenter', function() {
            updateStarsDisplay(rating, true);
            if (ratingLabels[rating]) {
                ratingText.textContent = `${ratingLabels[rating].text} (preview)`;
                ratingDescription.textContent = ratingLabels[rating].desc;
                ratingDescription.classList.add('show');
            }
        });
        
        star.addEventListener('mouseleave', function() {
            updateStarsDisplay(currentRating);
            if (currentRating > 0) {
                ratingText.textContent = ratingLabels[currentRating].text;
                ratingText.classList.add('selected');
                ratingDescription.textContent = ratingLabels[currentRating].desc;
                ratingDescription.classList.add('show');
            } else {
                ratingText.textContent = 'Selecciona una calificación';
                ratingText.classList.remove('selected');
                ratingDescription.textContent = '';
                ratingDescription.classList.remove('show');
            }
        });
    });
    
    function updateStarsDisplay(rating, isHover = false) {
        stars.forEach((star) => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.style.color = '#fbbf24';
                star.style.transform = isHover ? 'scale(1.1)' : 'scale(1)';
            } else {
                star.style.color = '#cbd5e1';
                star.style.transform = 'scale(1)';
            }
        });
    }
}

/* ===================================
   FUNCIONES AUXILIARES
   =================================== */

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 12 && cleaned.startsWith('52')) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4');
    }
    
    return phone; // Devolver original si no se puede formatear
}

function generateLeadId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `MR-${timestamp}-${random}`.toUpperCase();
}

function estimateDeliveryTime(address) {
    // Simulación de cálculo de tiempo de entrega basado en ubicación
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    
    if (postalCodeMatch) {
        const postalCode = parseInt(postalCodeMatch[0]);
        
        // Zonas de entrega rápida (mismo día)
        if (postalCode >= 1000 && postalCode <= 16999) {
            return 'mismo día';
        }
        // Zonas metropolitanas (24 horas)
        else if (postalCode >= 52000 && postalCode <= 57999) {
            return '24 horas';
        }
        // Otras zonas (48 horas)
        else {
            return '48 horas';
        }
    }
    
    return '24-48 horas'; // Tiempo por defecto
}

/* ===================================
   INICIALIZACIÓN COMPLETA
   =================================== */

// Asegurar que todas las funciones se inicialicen correctamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones adicionales
    initFormDraft();
    initAddressAutocomplete();
    
    // Agregar event listeners para tracking
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            trackFormInteraction('field_focus', input.name);
        });
        
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                trackFormInteraction('field_complete', input.name);
            }
        });
    });
    
    console.log('Form Handler - Todas las funciones inicializadas');
});

// Exportar funciones para uso global si es necesario
window.MediRentForm = {
    validateForm,
    calculatePrice,
    sendConversionEvent,
    showNotification
};