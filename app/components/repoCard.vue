<template>
    <div class="ui items">
        <div class="item">
            <div class="content">
                <div class="header">
                    <h2 class="mdl-card__title-text">{{ repository.name }}</h2>
                </div>
                <div class="description">
                    <p>Url: {{ repository.repository_url_https }}</p>
                    <p>Last updated: {{ repository.updated_at }}</p>
                </div>
                <div class="extra">
                    <confirm-modal v-if="showModal" :on-confirm="pushToEnv(env)"></confirm-modal>
                    <button @click="confirm" v-for="env in repository.environments" track-by="id"
                       class="ui labeled icon {{ env.color_label }} button">
                        <i class="upload icon"></i>
                        {{ env.name }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import beanstalk from '../lib/api'
import Loader from './loader.vue'
import ConfirmModal from './confirmModal.vue'
import MessageBox from 'vue-msgbox'
import moment from 'moment'

    export default {
        components: {Loader, ConfirmModal},

        props: ['repository'],

        data() {
          return {
              showModal: false
          }
        },

        created() {
           
        },
        methods: {
            confirm() {
                this.showModal = true
            },
            pushToEnv(env) {
               this.showModal = false
                alert('confirmed')
              /*  const message = `Deploy on branch: ${env.name} ?`
                const title   = `Confirm deployment on ${this.repository.name}`
                const options = {
                    confirmButtonText: 'Deploy',
                    cancelButtonText: 'Cancel'
                }
                MessageBox.confirm(message, title, options).then(() => {
                    //beanstalk.deploy(this.repository.repository.name, env.id, )
                })*/
            }
        }
    }
</script>