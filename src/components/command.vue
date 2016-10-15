<template>
    <div class="search flex-container">
        <input ref="search-input"
               v-model="search"
               class="shortcut-command"
               type="text"
        >
        <div v-show="search.length" class="ui divided items search-results">
            <div v-for="repo in searchableRepos" v-bind:key="repo.id">
                <div v-for="nameAndEnv in repo.nameAndEnvs"
                     track-by="id"
                     class="result item"
                     @click="sendDeployEvent(repo, nameAndEnv.id)"
                >
                    <div class="middle aligned content">
                        <span> {{ nameAndEnv.repoName }}</span>
                        <a v-bind:class="'ui small ' + nameAndEnv.colorLabel + ' label'">{{ nameAndEnv.envName }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        props: ['repositories', 'ready'],

        data() {
            return {
                search: ''
            }
        },

        computed: {
            searchableRepos() {
                if(this.ready) {
                    const repositories = this.repositories.map((repo) => {
                        repo.nameAndEnvs = []
                        for (let env of repo.environments) {
                            repo.nameAndEnvs.push(
                                    {
                                        name: repo.name + ' ' + env.name,
                                        repoName: repo.name,
                                        envName: env.name,
                                        colorLabel: env.color_label,
                                        id: env.id
                                    }
                            )
                        }
                        return repo

                    })
                    const searchRegex = new RegExp(this.search, 'i')
                    return repositories.filter((repo) => {
                        for(let nameAndEnv of repo.nameAndEnvs) {
                            return searchRegex.test(nameAndEnv.name)
                        }
                    })
                }
            }
        },

        methods: {
            sendDeployEvent(repo, envId) {
              this.$dispatch('deploy-repo', {repoId: repo.id, envId})
            }
        },

        events: {
            'focus-command'() {
                this.search = ''
                this.$refs.searchInput.focus()
            }
        }
    }
</script>