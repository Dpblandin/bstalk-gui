<template>
    <div class="demo-card-square mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">{{ repository.repository.name }}</h2>
        </div>
        <div class="mdl-card__supporting-text">
            Url: {{ repository.url }}
            Last updated: {{ repository.repository.updated_at }}
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <a v-for="env in environments"
               class="mdl-button mdl-button--colored
               mdl-js-button mdl-js-ripple-effect {{ env.color_label }}">
                {{ env.name }}
            </a>
        </div>
    </div>
</template>

<script>
import beanstalk from '../lib/api'
    export default {
        props: ['repository'],

        data() {
          return {
              environments: []
          }
        },

        ready() {
            beanstalk.getEnvironments(this.repository.repository.name, (envs) => {
                this.environments = envs;
            })
        }
    }
</script>