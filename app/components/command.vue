<template>
    <div class="search flex-container">
        <input v-el:search-input
               v-model="search"
               class="shortcut-command"
               type="text"
        >
        <div v-if="search.length" class="ui divided items search-results">
            <div v-for="repo in searchableRepos" track-by="id">
                <div v-for="nameAndEnv in repo.nameAndEnvs | filterBy search in 'name'" class="result item">
                    <div @click="sendDeployEvent(repo, nameAndEnv.id)" class="middle aligned content">
                        {{ nameAndEnv.name }}
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
            searchableRepos() {
                return this.repositories.map((repo) => {
                    repo.nameAndEnvs = []
                    for (let env of repo.environments) {
                        repo.nameAndEnvs.push(
                                {
                                    name: repo.name + ' ' + env.name,
                                    id: env.id
                                }
                        )
                    }

                    return repo

                })
            }
        },

        methods: {
            sendDeployEvent(repo, envId) {
              this.$dispatch('deploy-repo', {repoId: repo.id, envId})
            }
        },

        events: {
            'focus-command'() {
               this.$els.searchInput.focus();
            }
        }
    }
</script>