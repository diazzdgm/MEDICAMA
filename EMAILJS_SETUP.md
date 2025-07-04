# 📧 CONFIGURACIÓN EMAILJS PARA MEDICAMA

## ✅ CÓDIGO YA CONFIGURADO
El código ya está preparado para enviar cotizaciones a: **adiaz2@pttmexico.com**

## 🔧 PASOS PARA ACTIVAR EMAILJS

### **PASO 1: Crear Cuenta en EmailJS**
1. Ve a: https://www.emailjs.com/
2. Haz clic en "Sign Up" 
3. Crea una cuenta gratuita (incluye 200 emails/mes)
4. Confirma tu email

### **PASO 2: Configurar Servicio de Email**
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona **Gmail** (recomendado) o tu proveedor preferido
4. **Para Gmail:**
   - Conecta tu cuenta de Gmail
   - Autoriza EmailJS
5. **Anota el SERVICE_ID** (ejemplo: "service_abc123")

### **PASO 3: Crear Plantilla de Email**
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. **Copia esta plantilla:**

```
Asunto: 🏥 Nueva Cotización MEDICAMA - {{from_name}}

--- NUEVA SOLICITUD DE COTIZACIÓN ---

👤 DATOS DEL CLIENTE:
Nombre: {{from_name}}
Teléfono: {{customer_phone}}

📋 DETALLES DE LA SOLICITUD:
Duración estimada: {{duration}}
Pisos a subir: {{floors}}
Dirección: {{address}}

💬 MENSAJE ADICIONAL:
{{message}}

📅 FECHA Y HORA:
{{timestamp}}

🌐 ORIGEN:
{{source}}

---
Responder directamente a este email o contactar al cliente por WhatsApp: +52{{customer_phone}}
```

4. **Anota el TEMPLATE_ID** (ejemplo: "template_xyz789")

### **PASO 4: Obtener Claves**
1. Ve a "Account" → "General"
2. **Anota tu PUBLIC_KEY** (ejemplo: "user_abc123xyz")

### **PASO 5: Actualizar el Código**
En el archivo `assets/js/form-handler.js`, líneas 596-598, reemplaza:

```javascript
const SERVICE_ID = 'service_abc123';     // Tu SERVICE_ID real
const TEMPLATE_ID = 'template_xyz789';   // Tu TEMPLATE_ID real  
const PUBLIC_KEY = 'user_abc123xyz';     // Tu PUBLIC_KEY real
```

### **PASO 6: Probar**
1. Guarda los cambios
2. Recarga tu sitio web
3. Llena el formulario de cotización
4. ¡Deberías recibir el email en adiaz2@pttmexico.com!

## 🚀 EJEMPLO COMPLETO

**Código actualizado (líneas 596-598):**
```javascript
const SERVICE_ID = 'service_medicama123';
const TEMPLATE_ID = 'template_cotizacion456';  
const PUBLIC_KEY = 'user_publickey789';
```

## 📧 FORMATO DEL EMAIL QUE RECIBIRÁS

```
De: EmailJS <noreply@emailjs.com>
Para: adiaz2@pttmexico.com
Asunto: 🏥 Nueva Cotización MEDICAMA - Juan Pérez

--- NUEVA SOLICITUD DE COTIZACIÓN ---

👤 DATOS DEL CLIENTE:
Nombre: Juan Pérez
Teléfono: 5512345678

📋 DETALLES DE LA SOLICITUD:
Duración estimada: 2 a 3 meses
Pisos a subir: 1 piso
Dirección: Av. Reforma 123, Col. Centro, CDMX

💬 MENSAJE ADICIONAL:
Necesito la cama para mi padre que se recupera de una cirugía

📅 FECHA Y HORA:
3 de enero de 2025, 14:30

🌐 ORIGEN:
Sitio Web MEDICAMA
```

## ⚠️ NOTAS IMPORTANTES

1. **Límite Gratuito:** 200 emails/mes (suficiente para comenzar)
2. **Plan Pagado:** $15 USD/mes para emails ilimitados
3. **Seguridad:** Las claves se pueden ver en el código fuente, es normal para EmailJS
4. **Backup:** Si EmailJS falla, el sitio seguirá funcionando en modo simulación

## 🆘 SI TIENES PROBLEMAS

**Error común:** "SERVICE_ID not found"
- **Solución:** Verifica que el SERVICE_ID esté correcto

**No llegan emails:**
- Revisa spam/correo no deseado
- Verifica que el email destino sea correcto
- Comprueba en EmailJS dashboard si hay errores

**Formulario no envía:**
- Abre consola del navegador (F12)
- Busca errores en rojo
- Verifica que todas las claves estén correctas

---

**¿Necesitas ayuda?** El código ya está listo, solo faltan las 3 claves de EmailJS.