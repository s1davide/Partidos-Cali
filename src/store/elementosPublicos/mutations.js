import state from "./state"

export function asignaInstanciaPlugins (state, plugins) {
    state.plugins = plugins
}
export function modificaForm (state, nuevoValor) {
    state.form = nuevoValor
}
export function setSesionIniciada(state, estadoSesion) {
    state.sesionIniciada = estadoSesion
}
export function setLogo (state, base64img){
    state.logo = base64img
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
export function setFuncionCrearPartido (state, nuevoValor) {///En Index vue
    state.funcionCrearPartido = nuevoValor
}
export function setDialogoCrearPartido (state, nuevoValor) {///En Index vue
    state.dialogoCrearPartido = nuevoValor
}
export function setInformacionPartido (state, nuevoValor) {///En Index vue
    state.informacionPartido = nuevoValor
}