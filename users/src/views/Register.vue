<template>
    <div>
        <h2 class="title is-3 mt-5">Registro de usuário</h2>
        <hr>

        <div class="columns is-centered">
            <div class="column is-half">
                <div v-if="error != undefined">
                    <div class="notification is-danger is-light">
                        <p>{{ error }}</p>
                    </div>
                </div>
                <p class="is-size-5">Nome</p>
                <input type="text" v-model="name" class="input is-rounded my-2 has-text-centered has-text-dark"
                    placeholder="Nome do usuário">
                <p class="is-size-5">E-mail</p>
                <input type="email" v-model="email" class="input is-rounded my-2 has-text-centered has-text-dark"
                    placeholder="email@email.com">
                <p class="is-size-5">Senha</p>
                <input type="password" v-model="password" class="input is-rounded my-2 has-text-centered has-text-dark"
                    placeholder="******">
                <button @click="register" class="button is-success mt-4">Cadastrar</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            name: '',
            password: '',
            email: '',
            error: undefined
        }
    },
    methods: {
        register() {
            axios.post("http://localhost:8686/user", {
                name: this.name,
                password: this.password,
                email: this.email
            }).then(res => {
                console.log(res)
                this.$router.push({ name: 'home' })
            }).catch(err => {
                var msgErro = err.response.data.err
                this.error = msgErro
            })
        },
    },
}
</script>

<style scoped></style>