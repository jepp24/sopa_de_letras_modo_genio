# 🎮 Sopa de Letras: Modo Genio

![Premium UI Preview](public/preview_new_design_1778306676261.webp)

## 📖 Descripción
Una versión premium del clásico juego de "Sopa de Letras" adaptada a móviles con **Glassmorphism**, animaciones dinámicas y un sistema de temas personalizable. El objetivo es buscar palabras en una cuadrícula interactiva, con niveles progresivos y una experiencia visual de alto nivel.

## ✨ Características principales
- **Diseño Premium Glassmorphism**: fondos con orbes luminosos, partículas flotantes y botones con efecto shimmer.
- **Temas dinámicos**: Midnight, Emerald, Soft Rose y Nitro, guardados en `localStorage`.
- **Sonido inmersivo**: efectos de beep, alert y anguish con opción de activación/desactivación.
- **Compatibilidad multiplataforma**: empaquetado con **Capacitor** para Android e iOS.
- **Monetización preparada**: integración futura de AdMob (banner no invasivo).
- **Código limpio y documentado**: React + Vite + ES6, estilo con CSS variables.

## 🛠️ Tecnologías
| Categoría | Herramienta |
|-----------|--------------|
| Front‑end | React, Vite, Lucide Icons |
| Estilos  | CSS (variables, Glassmorphism) |
| Mobile   | Capacitor, Android, iOS |
| Build    | npm, vite, capacitor-cli |
| Fuente   | Google Fonts – Outfit & Playfair Display |

## 🚀 Instalación y desarrollo
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sopa-de-letras-modo-genio.git
cd sopa-de-letras-modo-genio

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (verás la UI premium en http://localhost:5177)
npm run dev
```

### Compilación para producción y sincronización con Capacitor
```bash
npm run build && npx cap sync
```
Luego abre el proyecto en Xcode o Android Studio:
```bash
npx cap open ios
npx cap open android
```

## 📱 Uso en dispositivos móviles
1. Ejecuta `npm run build && npx cap sync`.
2. Abre el proyecto en Xcode/Android Studio y lanza la app.
3. La aplicación mostrará la pantalla de inicio premium con botones **JUGAR**, **CONFIGURACIÓN** y **SALIR**.

## 🎨 Sistema de temas (incluido)
Los temas se cambian desde la pantalla de Configuración y se guardan en `localStorage`. Los colores están definidos en `src/index.css` mediante variables CSS.

## 📂 Estructura del proyecto
```
src/
│   App.jsx               # Lógica principal y UI premium
│   index.css             # Variables de tema y estilos Glassmorphism
│   main.jsx              # Punto de entrada
│   components/…          # Grid, Timer, etc.
public/
│   index.html            # Entrada HTML, carga de fuentes
│   PRIVACY_POLICY.html   # Política de privacidad
│   preview_new_design_…   # Imagen de referencia del UI premium
```

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Puedes ayudar a:
- Mejorar la lógica del juego o añadir nuevos niveles.
- Optimizar el rendimiento de los efectos visuales.
- Documentar más ejemplos de personalización de temas.

1. Fork el repositorio.
2. Crea una rama (`git checkout -b feature/tu-feature`).
3. Haz commit y pull request.

## 📜 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
*Desarrollado por Jota Padilla – 2026*

