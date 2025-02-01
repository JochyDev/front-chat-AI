# Frontend - Aplicación de ChatAI en Angular

## 📌 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

1. **Node.js** (versión recomendada: `>=16.x`)
2. **Angular CLI** (`npm install -g @angular/cli`)
3. **Servidor Backend** corriendo en `http://localhost:3000` o en la URL configurada

## 🚀 Instalación

Para instalar las dependencias y ejecutar la aplicación en desarrollo:

```bash
# Clonar el repositorio
git clone https://github.com/usuario/proyecto-chat-angular.git
```

# Acceder al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación
ng serve

# 🔑 Autenticación
## El sistema de autenticación incluye:

- Inicio de sesión (/login)
- Registro de usuarios (/register)
- Protección de rutas con Guards

# 🔄 Integración con WebSockets
- El chat usa WebSockets para la comunicación en tiempo real. Implementado con Socket.IO, permite:

- Crear nuevos chats
- Enviar y recibir mensajes en tiempo real
- Notificaciones de actividad

# 🔒 Seguridad
- Uso de JWT para autenticar usuarios
- Protección de rutas con Auth Guards
- Interceptores HTTP para añadir tokens a cada petición