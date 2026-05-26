'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const CLAVE_USUARIOS = 'vng_usuarios';

  const formulario = document.getElementById('formulario-inicio-sesion');
  const boton      = document.getElementById('boton-ingresar');

  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const correo     = document.getElementById('campo-correo-sesion').value.trim();
    const contrasena = document.getElementById('campo-contrasena-sesion').value;

    let valido = true;

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !regexCorreo.test(correo)) {
      mostrarError('error-correo-sesion', 'Ingresa un correo válido');
      valido = false;
    } else { ocultarError('error-correo-sesion'); }

    if (!contrasena || contrasena.length < 1) {
      mostrarError('error-contrasena-sesion', 'La contraseña es requerida');
      valido = false;
    } else { ocultarError('error-contrasena-sesion'); }

    if (!valido) return;

    const usuarios = obtenerUsuarios();
    const usuario  = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

    if (!usuario) {
      mostrarError('mensaje-estado-sesion', 'Correo o contraseña incorrectos');
      return;
    }

    boton.dataset.estado = 'cargando';
    boton.textContent    = 'ENTRANDO';

    window.Vanguard.autenticacion.guardarSesion(
      'tok_' + Date.now(),
      { nombre: usuario.nombre, correo: usuario.correo }
    );

    window.Vanguard.notificaciones.exito('Bienvenido a Vanguard');

    setTimeout(() => {
      window.location.href = 'categorias.html';
    }, 1500);
  });

  function obtenerUsuarios() {
    try {
      const datos = localStorage.getItem(CLAVE_USUARIOS);
      return datos ? JSON.parse(datos) : [];
    } catch {
      return [];
    }
  }

  function mostrarError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('mensaje-error-campo--visible');
  }

  function ocultarError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('mensaje-error-campo--visible');
  }
});
