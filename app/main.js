import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import beanstalk from './lib/api'

new Vue({
    components: {RepoCard},
    el: '#app',
    data() {
        return {
            repositories: []
        }
    },

    created() {
        beanstalk.getRepositories((repos) => {
           this.repositories = repos;
        });
    }
})




