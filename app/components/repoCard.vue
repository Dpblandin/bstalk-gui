<template>
    <div class="ui items">
        <div class="item">
            <div class="content">
                <div class="header">
                    <h2 class="mdl-card__title-text">{{ repository.name }}</h2>
                </div>
                <div class="description">
                    <p>Url: {{ repository.repository_url_https }}</p>
                    <p>Last updated: {{ formatedUpdatedDate }}</p>
                </div>
                <div class="extra">
                    <span v-for="env in repository.environments" track-by="id">
                        <confirm-modal v-if="showModal" :on-confirm="pushToEnv(env)"></confirm-modal>
                        <button @click="confirm"
                                class="ui labeled icon {{ env.color_label }} button">
                            <i class="upload icon"></i>
                            {{ env.name }}
                        </button>
                    </span>
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

        computed: {
            formatedUpdatedDate() {
                return moment(this.repository.updated_at).format('MMM Do YYYY [at] hh:mm')
            }
        },

        methods: {
            confirm() {
                this.showModal = true
            },
            pushToEnv(env) {
               this.showModal = false
                console.log(env)
                //beanstalk.deployToEnv(this.repository.name, env.id)
            }
        }
    }
</script>