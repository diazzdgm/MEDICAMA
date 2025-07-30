/* ===================================
   MEDICAMA - GOOGLE MAPS INTEGRATION
   =================================== */

let map;
let geocoder;
let freeDeliveryPolygon;
let paidDeliveryPolygon;

// INSTRUCCIONES DE USO:
// 1. Reemplaza 'YOUR_API_KEY' con tu clave real de Google Maps Platform
// 2. Asegúrate de que la API tenga habilitados: Maps JavaScript API, Geocoding API
// 3. Agrega las restricciones de dominio necesarias en Google Cloud Console

// Configuración de zonas de entrega
const DELIVERY_ZONES = {
    // ZONA DE ENTREGA GRATUITA (VERDE) - Coordenadas exactas proporcionadas
    freeDelivery: [
        { lat: 19.3667121, lng: -99.6935592 },
        { lat: 19.2928471, lng: -99.7223983 },
        { lat: 19.2565503, lng: -99.711412 },
        { lat: 19.2072775, lng: -99.6578537 },
        { lat: 19.1904176, lng: -99.6111618 },
        { lat: 19.1891207, lng: -99.5823226 },
        { lat: 19.2007932, lng: -99.5356308 },
        { lat: 19.2137616, lng: -99.4971786 },
        { lat: 19.2578467, lng: -99.4669662 },
        { lat: 19.2889585, lng: -99.4600997 },
        { lat: 19.3252481, lng: -99.4573532 },
        { lat: 19.3459814, lng: -99.4834457 },
        { lat: 19.3705988, lng: -99.5218978 },
        { lat: 19.3822583, lng: -99.5658432 },
        { lat: 19.3939171, lng: -99.6166549 },
        { lat: 19.3667121, lng: -99.6935592 }  // Cierre del polígono
    ],
    
    // ZONA DE ENTREGA CON COSTO (NARANJA) - Coordenadas exactas proporcionadas
    paidDelivery: [
        { lat: 19.1437198, lng: -99.4820724 },
        { lat: 19.1294484, lng: -99.4134079 },
        { lat: 19.1463145, lng: -99.2389999 },
        { lat: 19.1722589, lng: -99.1126571 },
        { lat: 19.2202455, lng: -98.9890609 },
        { lat: 19.2876623, lng: -98.8682113 },
        { lat: 19.3913263, lng: -98.8215194 },
        { lat: 19.4832728, lng: -98.8311325 },
        { lat: 19.5557573, lng: -98.847612 },
        { lat: 19.5881059, lng: -98.9121566 },
        { lat: 19.6178609, lng: -98.9821945 },
        { lat: 19.6476104, lng: -99.0137802 },
        { lat: 19.6540769, lng: -99.0563522 },
        { lat: 19.6747681, lng: -99.1208969 },
        { lat: 19.6721819, lng: -99.1978012 },
        { lat: 19.6889918, lng: -99.2609725 },
        { lat: 19.7032141, lng: -99.3159042 },
        { lat: 19.7096785, lng: -99.3845687 },
        { lat: 19.7057999, lng: -99.4806991 },
        { lat: 19.7032141, lng: -99.5878158 },
        { lat: 19.6864057, lng: -99.6702133 },
        { lat: 19.6553702, lng: -99.7292648 },
        { lat: 19.6424369, lng: -99.7855697 },
        { lat: 19.5906935, lng: -99.8734603 },
        { lat: 19.5272851, lng: -99.9228988 },
        { lat: 19.4573777, lng: -99.9668441 },
        { lat: 19.3680076, lng: -99.961351 },
        { lat: 19.2967355, lng: -99.8913131 },
        { lat: 19.2306191, lng: -99.7951828 },
        { lat: 19.1709618, lng: -99.7059188 },
        { lat: 19.1437198, lng: -99.4820724 }  // Cierre del polígono
    ]
};

// Inicializar el mapa cuando se carga la página
function initDeliveryMap() {
    // Configuración inicial del mapa centrado entre Ciudad de México y Toluca
    const mapCenter = { lat: 19.35, lng: -99.39 };
    
    // Crear el mapa
    map = new google.maps.Map(document.getElementById('delivery-map'), {
        zoom: 10,
        center: mapCenter,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Inicializar el geocoder para búsqueda de direcciones
    geocoder = new google.maps.Geocoder();
    
    // Crear polígonos de zonas de entrega
    createDeliveryZones();
    
    // Configurar el verificador de direcciones
    setupAddressChecker();
    
    // Configurar autocompletado de direcciones
    setupAddressAutocomplete();
    
    console.log('Mapa de zonas de entrega inicializado correctamente');
}

// Crear los polígonos de las zonas de entrega
function createDeliveryZones() {
    // Zona de entrega gratuita (verde)
    freeDeliveryPolygon = new google.maps.Polygon({
        paths: DELIVERY_ZONES.freeDelivery,
        strokeColor: '#00ff00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00ff00',
        fillOpacity: 0.3
    });
    freeDeliveryPolygon.setMap(map);
    
    // Zona de entrega con costo (naranja)
    paidDeliveryPolygon = new google.maps.Polygon({
        paths: DELIVERY_ZONES.paidDelivery,
        strokeColor: '#ffa500',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ffa500',
        fillOpacity: 0.3
    });
    paidDeliveryPolygon.setMap(map);
    
    // Agregar tooltips informativos a los polígonos
    freeDeliveryPolygon.addListener('mouseover', () => {
        showMapTooltip('Zona de Entrega Incluida');
    });
    
    paidDeliveryPolygon.addListener('mouseover', () => {
        showMapTooltip('Zona de Entrega con Costo Adicional');
    });
}

// Configurar el verificador de direcciones
function setupAddressChecker() {
    const addressInput = document.getElementById('address-input');
    const checkButton = document.getElementById('check-address-btn');
    const resultDiv = document.getElementById('address-result');
    
    // Manejar click del botón verificar
    checkButton.addEventListener('click', () => {
        console.log('=== USUARIO HIZO CLICK EN VERIFICAR ===');
        
        // OCULTAR SUGERENCIAS INMEDIATAMENTE
        hideAutocompleteSuggestions();
        
        const address = addressInput.value.trim();
        if (address) {
            checkAddressDeliveryZone(address);
        } else {
            showAddressResult('Por favor, ingresa una dirección válida', 'outside');
        }
    });
    
    // Manejar Enter en el campo de dirección
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('=== USUARIO PRESIONÓ ENTER ===');
            e.preventDefault();
            
            // OCULTAR SUGERENCIAS INMEDIATAMENTE
            hideAutocompleteSuggestions();
            
            checkButton.click();
        }
    });
}

// Verificar en qué zona de entrega está una dirección
function checkAddressDeliveryZone(address) {
    const checkButton = document.getElementById('check-address-btn');
    
    // Ocultar sugerencias de autocomplete si están visibles
    hideAutocompleteSuggestions();
    
    // Deshabilitar botón temporalmente sin cambiar el texto
    checkButton.disabled = true;
    
    // Geocodificar la dirección
    geocoder.geocode({ address: address + ', México' }, (results, status) => {
        checkButton.disabled = false;
        
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            // Verificar en qué zona está la dirección
            const zone = determineDeliveryZone(lat, lng);
            
            // Mostrar resultado
            switch (zone) {
                case 'free':
                    showAddressResult('✅ ¡Excelente! Tu dirección está en zona de entrega incluida', 'free');
                    break;
                case 'paid':
                    showAddressResult('📦 Tu dirección está en zona de entrega con costo adicional', 'paid');
                    break;
                default:
                    showAddressResult('❌ Lo sentimos, tu dirección está fuera de nuestras zonas de cobertura', 'outside');
            }
            
            // Centrar el mapa en la dirección encontrada
            map.setCenter(location);
            map.setZoom(15);
            
            // Agregar marcador temporal
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: address,
                animation: google.maps.Animation.DROP
            });
            
            // Remover marcador después de 5 segundos
            setTimeout(() => {
                marker.setMap(null);
            }, 5000);
            
        } else {
            showAddressResult('❌ No se pudo encontrar la dirección. Verifica que esté correcta', 'outside');
        }
    });
}

// Determinar en qué zona de entrega está una coordenada
function determineDeliveryZone(lat, lng) {
    const point = new google.maps.LatLng(lat, lng);
    
    // Verificar si está en zona gratuita
    if (google.maps.geometry.poly.containsLocation(point, freeDeliveryPolygon)) {
        return 'free';
    }
    
    // Verificar si está en zona con costo
    if (google.maps.geometry.poly.containsLocation(point, paidDeliveryPolygon)) {
        return 'paid';
    }
    
    // Fuera de cobertura
    return 'outside';
}

// Mostrar el resultado de la verificación de dirección
function showAddressResult(message, type) {
    // Ocultar sugerencias de autocomplete antes de mostrar el resultado
    hideAutocompleteSuggestions();
    
    const resultDiv = document.getElementById('address-result');
    resultDiv.textContent = message;
    resultDiv.className = `address-result ${type}`;
    resultDiv.style.display = 'block';
    
    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 10000);
}

// Mostrar tooltip informativo en el mapa
function showMapTooltip(message) {
    // Implementación simple de tooltip - puedes mejorarla según necesites
    console.log('Zona:', message);
}

// Función para cargar el mapa cuando esté listo
function initMapsWhenReady() {
    if (typeof google !== 'undefined' && google.maps) {
        initDeliveryMap();
    } else {
        console.log('Esperando a que se cargue Google Maps API...');
        setTimeout(initMapsWhenReady, 100);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya se cargó Google Maps
    initMapsWhenReady();
});

// Configurar autocompletado de direcciones con Google Places
function setupAddressAutocomplete() {
    console.log('=== CONFIGURANDO AUTOCOMPLETADO ===');
    
    const addressInput = document.getElementById('address-input');
    
    if (!addressInput) {
        console.error('Campo de dirección no encontrado para autocompletar');
        console.log('Elementos con ID address-input:', document.querySelectorAll('#address-input'));
        return;
    }
    
    console.log('Campo de dirección encontrado:', addressInput);
    
    // Limpiar clases previas de Google Places si existen
    addressInput.classList.remove('pac-target-input');
    addressInput.removeAttribute('autocomplete');
    console.log('Input limpiado:', addressInput);
    
    // Verificar que Google Places esté disponible
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.error('Google Places API no está disponible');
        console.log('google:', typeof google);
        console.log('google.maps:', typeof google?.maps);
        console.log('google.maps.places:', typeof google?.maps?.places);
        return;
    }
    
    console.log('Google Places API disponible');
    
    // Configurar opciones del autocompletado (simplificadas)
    const autocompleteOptions = {
        // Solo restringir a México
        componentRestrictions: { country: 'mx' },
        
        // Tipos de lugares permitidos
        types: ['address']
    };
    
    // Usar el nuevo PlaceAutocompleteElement (recomendado por Google)
    console.log('Creando PlaceAutocompleteElement...');
    
    try {
        // Crear el elemento de autocompletado
        const autocompleteElement = document.createElement('gmp-place-autocomplete');
        
        // Configurar atributos
        autocompleteElement.setAttribute('countries', 'mx');
        autocompleteElement.setAttribute('types', 'address');
        
        // Configurar restricciones geográficas para México central
        const bounds = {
            north: 19.6,
            south: 19.2,
            east: -99.0,
            west: -99.8
        };
        
        // Temporalmente usar el método anterior hasta que el nuevo esté totalmente disponible
        if (false && typeof google.maps.places.PlaceAutocompleteElement !== 'undefined') {
            console.log('Usando PlaceAutocompleteElement (nuevo)');
            
            // Reemplazar el input original con el nuevo elemento
            const parent = addressInput.parentNode;
            autocompleteElement.id = 'direccion';
            autocompleteElement.className = addressInput.className;
            autocompleteElement.placeholder = 'Empieza a escribir tu dirección...';
            
            // Copiar estilos importantes
            autocompleteElement.style.width = '100%';
            autocompleteElement.style.padding = '12px';
            autocompleteElement.style.border = '2px solid #cbd5e1';
            autocompleteElement.style.borderRadius = '8px';
            autocompleteElement.style.fontSize = '16px';
            
            parent.replaceChild(autocompleteElement, addressInput);
            
            // Agregar listener para cuando se selecciona un lugar
            autocompleteElement.addEventListener('gmp-placeselect', (event) => {
                const place = event.detail.place;
                console.log('Lugar seleccionado (nuevo API):', place);
                
                if (place.location) {
                    const lat = place.location.lat();
                    const lng = place.location.lng();
                    
                    console.log('Dirección seleccionada:', place.formattedAddress);
                    console.log('Coordenadas:', lat, lng);
                    
                    // Verificar zona de entrega
                    const location = new google.maps.LatLng(lat, lng);
                    checkDeliveryZone(location, place.formattedAddress);
                    
                    // Centrar mapa
                    if (map) {
                        map.setCenter(location);
                        map.setZoom(16);
                        
                        // Agregar marcador
                        if (window.selectedLocationMarker) {
                            window.selectedLocationMarker.setMap(null);
                        }
                        
                        window.selectedLocationMarker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: 'Dirección seleccionada',
                            icon: {
                                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            }
                        });
                    }
                }
            });
        } else {
            // Fallback al método anterior
            console.log('Usando Autocomplete (método anterior)');
            console.log('Opciones para autocomplete:', autocompleteOptions);
            console.log('Input element:', addressInput);
            
            // Probar primero sin opciones
            let autocomplete;
            try {
                console.log('Intentando crear autocomplete SIN opciones...');
                autocomplete = new google.maps.places.Autocomplete(addressInput);
                console.log('Autocomplete SIN opciones creado exitosamente:', autocomplete);
            } catch (error) {
                console.error('Error creando autocomplete sin opciones:', error);
                try {
                    console.log('Intentando crear autocomplete CON opciones básicas...');
                    autocomplete = new google.maps.places.Autocomplete(addressInput, { 
                        componentRestrictions: { country: 'mx' } 
                    });
                    console.log('Autocomplete CON opciones básicas creado:', autocomplete);
                } catch (error2) {
                    console.error('Error creando autocomplete con opciones:', error2);
                    return;
                }
            }
            
            autocomplete.addListener('place_changed', function() {
                console.log('=== USUARIO SELECCIONÓ UNA SUGERENCIA ===');
                
                // OCULTAR SUGERENCIAS INMEDIATAMENTE
                setTimeout(() => {
                    hideAutocompleteSuggestions();
                }, 100);
                
                const place = autocomplete.getPlace();
                
                if (!place.geometry || !place.geometry.location) {
                    console.warn('No se encontraron detalles de ubicación para:', place.name);
                    return;
                }
                
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                console.log('Dirección seleccionada:', place.formatted_address);
                console.log('Coordenadas:', lat, lng);
                
                const location = new google.maps.LatLng(lat, lng);
                checkDeliveryZone(location, place.formatted_address);
                
                if (map) {
                    map.setCenter(location);
                    map.setZoom(16);
                    
                    if (window.selectedLocationMarker) {
                        window.selectedLocationMarker.setMap(null);
                    }
                    
                    window.selectedLocationMarker = new google.maps.Marker({
                        position: location,
                        map: map,
                        title: 'Dirección seleccionada',
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }
                    });
                }
            });
            
            // Controlar visibilidad de sugerencias con focus/blur
            addressInput.addEventListener('focus', function() {
                console.log('=== INPUT RECIBIÓ FOCUS ===');
                
                // Cambiar placeholder
                if (this.placeholder === 'Ingresa tu dirección para verificar la zona de entrega') {
                    this.placeholder = 'Empieza a escribir tu dirección...';
                }
                
                // Mostrar sugerencias cuando el usuario hace focus
                showAutocompleteSuggestions();
            });
            
            addressInput.addEventListener('blur', function() {
                console.log('=== INPUT PERDIÓ FOCUS ===');
                
                // Restaurar placeholder
                if (!this.value) {
                    this.placeholder = 'Ingresa tu dirección para verificar la zona de entrega';
                }
                
                // Ocultar sugerencias cuando pierde focus (con un pequeño delay)
                setTimeout(() => {
                    // Solo ocultar si no se está haciendo clic en una sugerencia
                    const activeElement = document.activeElement;
                    if (!activeElement || !activeElement.closest('.pac-container')) {
                        hideAutocompleteSuggestions();
                    }
                }, 150);
            });
            
            // Test para verificar que el autocomplete esté funcionando
            setTimeout(() => {
                console.log('=== TEST DE AUTOCOMPLETE ===');
                console.log('Input después de configuración:', addressInput);
                console.log('Clases del input:', addressInput.className);
                console.log('Atributos del input:', {
                    autocomplete: addressInput.getAttribute('autocomplete'),
                    placeholder: addressInput.placeholder,
                    disabled: addressInput.disabled
                });
                
                // Verificar si Google agregó sus clases
                const pacContainer = document.querySelector('.pac-container');
                console.log('Contenedor PAC encontrado:', pacContainer);
                
                // Simular focus para activar autocomplete
                addressInput.focus();
                console.log('Focus aplicado al input');
            }, 1000);
        }
    
        console.log('Autocompletado de direcciones configurado correctamente');
        
    } catch (error) {
        console.error('Error al crear autocomplete:', error);
        console.log('Detalles del error:', {
            message: error.message,
            stack: error.stack
        });
    }
}

// Función para ocultar sugerencias de autocomplete
function hideAutocompleteSuggestions() {
    console.log('=== OCULTANDO SUGERENCIAS ===');
    
    // Buscar TODOS los contenedores de sugerencias de Google Places
    const pacContainers = document.querySelectorAll('.pac-container');
    
    pacContainers.forEach((pacContainer, index) => {
        if (pacContainer) {
            console.log(`Ocultando contenedor PAC ${index + 1}`);
            // Ocultar completamente
            pacContainer.style.display = 'none !important';
            pacContainer.style.visibility = 'hidden';
            pacContainer.style.opacity = '0';
            pacContainer.style.zIndex = '-1';
        }
    });
    
    // Remover focus del input para cerrar completamente el autocomplete
    const addressInput = document.getElementById('address-input');
    if (addressInput) {
        console.log('Removiendo focus del input');
        addressInput.blur();
        
        // Simular Escape key para cerrar autocomplete
        const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true
        });
        addressInput.dispatchEvent(escapeEvent);
    }
    
    // NO restaurar automáticamente - solo cuando el usuario haga focus
}

// Función para mostrar sugerencias de autocomplete
function showAutocompleteSuggestions() {
    console.log('=== MOSTRANDO SUGERENCIAS ===');
    
    // Buscar TODOS los contenedores de sugerencias de Google Places
    const pacContainers = document.querySelectorAll('.pac-container');
    
    pacContainers.forEach((pacContainer, index) => {
        if (pacContainer) {
            console.log(`Mostrando contenedor PAC ${index + 1}`);
            // Restaurar visibilidad
            pacContainer.style.display = '';
            pacContainer.style.visibility = '';
            pacContainer.style.opacity = '';
            pacContainer.style.zIndex = '';
        }
    });
}

// Exponer función global para el callback de Google Maps
window.initDeliveryMap = initDeliveryMap;

/* ===================================
   INSTRUCCIONES DE PERSONALIZACIÓN
   =================================== */

/*
PARA PERSONALIZAR LAS ZONAS DE ENTREGA:

1. Edita el objeto DELIVERY_ZONES arriba con tus coordenadas reales:
   - freeDelivery: array de coordenadas para zona gratuita
   - paidDelivery: array de coordenadas para zona con costo

2. Para obtener coordenadas fácilmente:
   - Ve a Google Maps
   - Haz clic derecho en un punto
   - Selecciona las coordenadas que aparecen
   - Agrega como: { lat: LATITUD, lng: LONGITUD }

3. Ejemplo de zona rectangular:
   freeDelivery: [
       { lat: 19.4500, lng: -99.1500 }, // Esquina superior izquierda
       { lat: 19.4500, lng: -99.1200 }, // Esquina superior derecha
       { lat: 19.4200, lng: -99.1200 }, // Esquina inferior derecha
       { lat: 19.4200, lng: -99.1500 }  // Esquina inferior izquierda
   ]

4. Los polígonos pueden tener tantos puntos como necesites para definir
   formas complejas que se adapten a tus zonas de entrega reales.
*/