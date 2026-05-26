'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const CLAVE_USUARIOS = 'vng_usuarios';

  const formulario = document.getElementById('formulario-registro-usuario');
  const boton      = document.getElementById('boton-enviar-registro');

  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre     = document.getElementById('campo-nombre-usuario').value.trim();
    const correo     = document.getElementById('campo-correo-registro').value.trim();
    const contrasena = document.getElementById('campo-contrasena-registro').value;

    let valido = true;

    if (!nombre || nombre.length < 2) {
      mostrarError('error-nombre-usuario', 'El nombre debe tener al menos 2 caracteres');
      valido = false;
    } else { ocultarError('error-nombre-usuario'); }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !regexCorreo.test(correo)) {
      mostrarError('error-correo-registro', 'Ingresa un correo válido');
      valido = false;
    } else { ocultarError('error-correo-registro'); }

    if (!contrasena || contrasena.length < 8) {
      mostrarError('error-contrasena-registro', 'La contraseña debe tener al menos 8 caracteres');
      valido = false;
    } else { ocultarError('error-contrasena-registro'); }

    if (!valido) return;

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.correo === correo)) {
      mostrarError('error-correo-registro', 'Este correo ya está registrado');
      return;
    }

    usuarios.push({ nombre, correo, contrasena });
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));

    window.Vanguard.notificaciones.exito('Registro exitoso');

    formulario.reset();
    limpiarErrores();

    setTimeout(() => {
      window.location.href = 'login.html';
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

  function limpiarErrores() {
    document.querySelectorAll('.mensaje-error-campo').forEach(el => {
      el.textContent = '';
      el.classList.remove('mensaje-error-campo--visible');
    });
  }
});
