<template>
    <div class="search flex-container">
        <input v-el:search-input
               @keydown="sendSearchEvent"
               v-model="search"
               class="shortcut-command"
               type="text"
        >
        <div v-show="hasResults" class="ui divided items search-results">
            <div v-for="repo in foundRepos" track-by="id">
                <div v-if="!envSearch" v-for="nameAndEnv in repo.nameAndEnvs" class="result item">
                    <div class="middle aligned content">
                        {{ nameAndEnv }}
                    </div>
                </div>
                <div v-if="envSearch" v-for="match in repo.matched" class="result item">
                    <div class="middle aligned content">
                        {{ match }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        props: ['repositories'],

        data() {
            return {
                search: '',
            }
        },

        computed: {
            envSearch() {
                const [repoName, env] = this.search.split(' ')

                return env !== undefined
            },
            foundRepos() {
                // (renault-qu)+(.)*( )+(rec?)+
                if(this.search.length > 0) {
                    const [repoName, env] = this.search.split(' ')
                    let regex = new RegExp(`(${repoName})+(.)*( )+(.*?)+`, 'i')
                    if(env) {
                        regex = new RegExp(`(${repoName})+(.)*( )+(.*${env}?)+`, 'i')
                    }

                    return this.repositories.filter((repo) => {
                        repo.nameAndEnvs = []
                        for (let env in repo.environments) {
                            repo.nameAndEnvs.push(repo.name + ' ' + env)
                        }


                        repo.matched = []
                        for (let env of repo.nameAndEnvs) {
                            if (regex.exec(env)) {
                                repo.matched.push(env)
                            }
                        }

                    return repo.matched.length > 0

                    })
                }

                return []
            },

            hasResults() {
                return this.foundRepos.length > 0
            }
        },

        methods: {
            sendSearchEvent() {
                //this.$dispatch('repos-search', this.search)
            }
        },

        events: {
            'focus-command'() {
               this.$els.searchInput.focus();
            }
        }
    }
</script>