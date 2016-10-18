<template>
    <div class="item">
        <div class="content">
            <div class="header">
                <h2>{{ repository.name }}</h2>
            </div>
            <div class="description">
                <p>Url: {{ repository.repository_url_https }}</p>
                <p>Last updated: {{ formatedUpdatedDate }}</p>
            </div>
            <div class="extra">
                    <span v-for="env in repository.environments" v-bind:key="env.id">
                       <environment :repository="repository" :environment="env"></environment>
                    </span>
            </div>
        </div>
    </div>
</template>

<script>
import Environment from './environment.vue'
import moment from 'moment'

    export default {
        components: {Environment},

        props: ['repository'],

        computed: {
            formatedUpdatedDate() {
                return moment(this.repository.updated_at).format('MMM Do YYYY [at] HH:mm')
            }
        }
    }
</script>