async function listarUsuarios() {
    
    const url = "http://localhost:8080/queridofogao/v1/usuarios"

    const response = await fetch(url)

    const usuarios = await response.json()

    console.log(usuarios)
    return usuarios
     
}

async function criarUsuario(usuario) {

    const url = "http://localhost:8080/queridofogao/v1/usuarios"

    const options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },

        body: JSON.stringify(usuario)

    }

    const response = await fetch(url, options)

    console.log(response.ok)
    return response.ok

}

async function deletarUsuario(id) {
 
    const url = `http://localhost:8080/queridofogao/v1/${id}`

    const options = {
        method: "DELETE"
    }

    const response = await fetch(url, options)

    return response.ok
    
}

async function atualizarUsuario(id, usuario) {

    const url = `http://localhost:8080/queridofogao/v1/${id}`

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },

        body: JSON.stringify(usuario)
    }
    
    const response = await fetch(url, options)

    console.log(response.ok)
    return response.ok

}

listarUsuarios()