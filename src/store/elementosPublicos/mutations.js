export function asignaInstanciaPlugins (state, plugins) {
    state.plugins = plugins
}
export function modificaForm (state, nuevoValor) {
    state.form = nuevoValor
}
export function asignaFuncionCrearPartido (state, nuevoValor) {
    state.crearPartido = nuevoValor
}
export function setSesionIniciada(state, estadoSesion) {
    state.sesionIniciada = estadoSesion
}
export function setMenuConfiguracionPerfil (state, valorMenu){
    state.menuConfiguracionPerfil = valorMenu
}
export function setInformacionUsuario(state, info) {
    state.informacionUsuario = info
}
export function setImagenBase(state, urlImagen) {
    state.imagenBase = urlImagen
    
}

