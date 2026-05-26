'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const formularioRegistroUsuario = document.getElementById('formulario-registro-usuario');
  const botonEnviarRegistro       = document.getElementById('boton-enviar-registro');

  if (formularioRegistroUsuario) {
    formularioRegistroUsuario.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const valorNombre      = document.getElementById('campo-nombre-usuario').value.trim();
      const valorCorreo      = document.getElementById('campo-correo-registro').value.trim();
      const valorContrasena  = document.getElementById('campo-contrasena-registro').value;

      let formularioEsValido = true;

      if (!valorNombre || valorNombre.length < 2) {
        mostrarErrorCampo('error-nombre-usuario', 'El nombre debe tener al menos 2 caracteres');
        formularioEsValido = false;
      } else { ocultarErrorCampo('error-nombre-usuario'); }

      const expresionRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!valorCorreo || !expresionRegularCorreo.test(valorCorreo)) {
        mostrarErrorCampo('error-correo-registro', 'Ingresa un correo electrónico válido');
        formularioEsValido = false;
      } else { ocultarErrorCampo('error-correo-registro'); }

      if (!valorContrasena || valorContrasena.length < 8) {
        mostrarErrorCampo('error-contrasena-registro', 'La contraseña debe tener al menos 8 caracteres');
        formularioEsValido = false;
      } else { ocultarErrorCampo('error-contrasena-registro'); }

      if (!formularioEsValido) return;

      botonEnviarRegistro.textContent = 'ENVIANDO';
      botonEnviarRegistro.dataset.estado = 'cargando';

      try {
        console.log('[VANGUARD] Registro — datos listos:', {
          nombre:            valorNombre,
          correoElectronico: valorCorreo
        });

        setTimeout(() => {
          botonEnviarRegistro.textContent = 'ENVÍAR';
          delete botonEnviarRegistro.dataset.estado;
        }, 1200);

      } catch (errorDeRed) {
        console.error('[VANGUARD] Error de red:', errorDeRed);
        mostrarErrorCampo('mensaje-estado-registro', 'Error de conexión. Intenta nuevamente.');
        botonEnviarRegistro.textContent = 'ENVÍAR';
        delete botonEnviarRegistro.dataset.estado;
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
