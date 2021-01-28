export function seleccionarAccionLogin ({commit}, accion) {
    commit('modificaForm',accion)    
    this.$router.push('login')
}

