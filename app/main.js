import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import Loader from './components/loader.vue'
import Command from './components/command.vue'
import beanstalk from './lib/api'
import {ipcRenderer} from 'electron'

new Vue({
    components: {RepoCard, Loader, Command},
    el: '#app',
    data() {
        return {
            repositories: [],
            isLoading: true,
            commandOpened: false,
            searchTerm: null
        }
    },

    created() {
        beanstalk.getRepositories((repos) => {
            this.repositories = repos.map((repo) => {
                return repo.repository
            });
            this.isLoading = false
        })
    },

    ready() {
        ipcRenderer.on('shortcut-command', (event, arg) => {
            this.toggleCommand()
            if(this.commandOpened) {
                this.$nextTick(() => {
                    this.$broadcast('focus-command');
                })
            }
        })

        ipcRenderer.on('exit-command', (event, arg) => {
            this.toggleCommand()
        })
    },

    methods: {
        toggleCommand() {
            this.commandOpened = !this.commandOpened
        }
    },

    events: {
        'repos-search'(search) {
            this.searchTerm = search
           /* if(search.length === 0) {
                this.searchedRepositories = this.repositories
            }
            else {
                const regex = new RegExp(search, 'ig');
                const foundRepos = this.repositories.filter((repo) => {
                    return repo.name.match(regex)
                })

                if(foundRepos.length > 0) {
                    this.searchedRepositories = foundRepos
                }
            }*/
        }
    }
})




