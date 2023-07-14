<template>
  <div>
    <h1 class="title is-4 my-6 has-text-grey-darker">Painel Administrativo</h1>

    <table class="table is-inline-tablet is-hoverable is-narrow is-striped is-bordered">
      <thead>
        <tr>
          <th class="has-text-centered">Nome</th>
          <th class="has-text-centered">E-mail</th>
          <th class="has-text-centered">Cargo</th>
          <th class="has-text-centered">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="has-text-centered">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ processRole(user.role) }}</td>
          <td> <router-link :to="{name: 'edit', params: {id: user.id}}"> <button class="button is-success">Editar</button> </router-link>
            <button class="button is-danger" @click="showModalUser(user.id)">Deletar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div :class="{ modal: true, 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-content">

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Deseja realmente deletar este usuário?
            </p>
            <button class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </header>
          <div class="card-content">
            <div class="content">
              <p>Ao deletar este usuário ele deixará de existir no seu banco de dados. Todos os campos,
                informações e dados serão excluídos imediatamente. Ciente disto, basta clicar em <strong>DELETAR</strong>,
                caso contrário basta <strong>CANCELAR</strong> este procedimento.
              </p>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item" @click="hideModal()">Cancelar</a>
            <a href="#" class="card-footer-item" @click="deleteUser()">Deletar</a>
          </footer>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="hideModal()"></button>
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

    axios.get("http://localhost:8686/user", req).then(res => {
      console.log(res);
      this.users = res.data
    }).catch(err => {
      console.log(err);
    })
    console.log("olá");
  },

  data() {
    return {
      users: [],
      showModal: false,
      deleteUserId: -1
    }
  },
  methods: {
    processRole: function (role) {
      if (role == 0) {
        return "Usuário"
      } else if (role == 1) {
        return "Administrador"
      }
    },
    hideModal() {
      this.showModal = false
    },
    showModalUser(id) {
      this.deleteUserId = id;
      this.showModal = true;
    },
    deleteUser() {
      var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      }
      axios.delete("http://localhost:8686/user/" + this.deleteUserId, req).then(res => {
        console.log(res)
        this.showModal = false
        this.users = this.users.filter(u => u.id != this.deleteUserId)
      }).catch(err => {
        console.log(err)
        this.showModal = false
      })
    }
  }

}
</script>

<style scoped></style>