'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const formularioInicioSesion = document.getElementById('formulario-inicio-sesion');
  const botonIngresar          = document.getElementById('boton-ingresar');

  if (formularioInicioSesion) {
    formularioInicioSesion.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const valorCorreo     = document.getElementById('campo-correo-sesion').value.trim();
      const valorContrasena = document.getElementById('campo-contrasena-sesion').value;

      let formularioEsValido = true;

      const expresionRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!valorCorreo || !expresionRegularCorreo.test(valorCorreo)) {
        mostrarErrorCampo('error-correo-sesion', 'Ingresa un correo electrónico válido');
        formularioEsValido = false;
      } else {
        ocultarErrorCampo('error-correo-sesion');
      }

      if (!valorContrasena || valorContrasena.length < 1) {
        mostrarErrorCampo('error-contrasena-sesion', 'La contraseña es requerida');
        formularioEsValido = false;
      } else {
        ocultarErrorCampo('error-contrasena-sesion');
      }

      if (!formularioEsValido) return;

      botonIngresar.dataset.estado = 'cargando';
      botonIngresar.textContent    = 'ENTRANDO';

      try {
        console.log('[VANGUARD] Inicio de sesión — datos listos para enviar:', {
          correoElectronico: valorCorreo
        });

        setTimeout(() => {
          botonIngresar.textContent    = 'ENTRAR';
          delete botonIngresar.dataset.estado;
        }, 1200);

      } catch (errorDeRed) {
        console.error('[VANGUARD] Error de red:', errorDeRed);
        mostrarErrorCampo('mensaje-estado-sesion', 'Error de conexión. Intenta nuevamente.');
        botonIngresar.textContent    = 'ENTRAR';
        delete botonIngresar.dataset.estado;
      }
    });
  }

  function mostrarErrorCampo(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.classList.add('mensaje-error-campo--visible');
  }

  function ocultarErrorCampo(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.textContent = '';
    elemento.classList.remove('mensaje-error-campo--visible');
  }
});
