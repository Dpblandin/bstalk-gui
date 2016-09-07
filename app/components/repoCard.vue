<template>
    <div class="demo-card-square mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">{{ repository.name }}</h2>
        </div>
        <div class="mdl-card__supporting-text">
            <span>Url: {{ repository.repository_url_https }}</span>
            <span>Last updated: {{ repository.updated_at }}</span>
        </div>
        <div v-show="isLoading" class="mdl-card__actions mdl-card--border">
           <loader type="circular"></loader>
        </div>
        <div v-if="!isLoading" class="mdl-card__actions mdl-card--border">
            <a @click="pushToEnv(env)" v-for="env in repository.environments" track-by="id"
               class="mdl-button mdl-button--colored
               mdl-js-button mdl-js-ripple-effect {{ env.color_label }}">
                {{ env.name }}
            </a>
        </div>
    </div>
</template>

<script>
import beanstalk from '../lib/api'
import Loader from './loader.vue'
import MessageBox from 'vue-msgbox'

    export default {
        components: {Loader},

        props: ['repository'],

        data() {
          return {
              isLoading: true
          }
        },

        created() {
            beanstalk.getEnvironments(this.repository.name, (envs) => {
                this.repository.environments = envs;
                this.isLoading = false;
            })
        },
        methods: {
            pushToEnv(env) {
                const message = `Deploy on branch: ${env.name} ?`
                const title   = `Confirm deployment on ${this.repository.name}`
                const options = {
                    confirmButtonText: 'Deploy',
                    cancelButtonText: 'Cancel'
                }
                MessageBox.confirm(message, title, options).then(() => {
                    //beanstalk.deploy(this.repository.repository.name, env.id, )
                })
            }
        }
    }
</script>