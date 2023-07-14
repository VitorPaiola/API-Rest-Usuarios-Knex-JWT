<template>
    <div>
        <h2 class="title is-3 mt-5">Edição de usuário</h2>
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
                <button @click="update" class="button is-success mt-4">Editar</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    created() {

        var req = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }

        axios.get("http://localhost:8686/user/" + this.$route.params.id, req).then(res => {
            console.log(res)

            this.name = res.data.name
            this.email = res.data.email
            this.id = res.data.id

        }).catch(err => {
            console.log(err.response)
            this.$router.push({ name: 'users' })
        })

    },
    data() {
        return {
            name: '',
            email: '',
            id: -1,
            error: undefined
        }
    },
    methods: {
        update() {

            var req = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            }

            axios.put("http://localhost:8686/user", {
                name: this.name,
                email: this.email,
                id: this.id
            }, req).then(res => {
                console.log(res)
                this.$router.push({ name: 'users' })
            }).catch(err => {
                var msgErro = err.response.data.err
                this.error = msgErro
            })
        },
    },
}
</script>

<style scoped></style>