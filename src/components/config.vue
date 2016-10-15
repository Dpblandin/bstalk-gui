<template>
    <div>
        <div class="ui segment">
            <form class="ui form">
                <div class="field">
                    <label>Account</label>
                    <input v-model="newAccount" type="text" name="newAccount" placeholder="Beanstalk account">
                </div>
                <div class="field">
                    <label>Username</label>
                    <input v-model="newUsername" type="text" name="newUsername" placeholder="Beanstalk username">
                </div>
                <div class="field">
                    <label>Token</label>
                    <input v-model="newToken" type="text" name="newToken" placeholder="Beanstalk token">
                </div>
                <button v-bind:disabled="!isValid"
                        @click="saveConfig"
                        class="ui primary button"
                        type="submit">
                    Save and close
                </button>
                <button v-bind:disabled="!clearReposEntity.enabled"
                        @click.prevent="clearReposCache"
                        class="ui grey button"
                        type="submit">
                    {{ clearReposEntity.message }}
                </button>
            </form>
        </div>
        <div class="ui segment">
            <h3>Shortcut commands</h3>
            <p><i>CTRL / CMD + P</i> : Open search bar</p>
            <p><i>CTRL / CMD + R</i> : Refresh</p>
        </div>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron'
    import eventHub from '../events/hub'

    export default {
        props: ['account', 'username', 'token'],
        data() {
            return {
                newAccount: this.account,
                newUsername: this.username,
                newToken: this.token,

                clearReposEntity: {
                    message: 'Clear repositories cache',
                    enabled: true
                }
            }
        },
        computed: {
            hasNewConfigItem() {
               return this.account !== this.newAccount
                || this.username !== this.newUsername
                || this.token !== this.newToken
            },

            isValid() {
                return this.newAccount.length > 0
                        && this.newUsername.length > 0
                        && this.newToken.length > 0
            }
        },

        methods: {
            saveConfig() {
                if(this.hasNewConfigItem) {
                    const config = {
                        account: this.newAccount,
                        username: this.newUsername,
                        token: this.newToken
                    }
                    ipcRenderer.send('config-file-changed', config)
                    eventHub.$emit('main.config-file-changed', config)
                }
            },

            clearReposCache() {
                ipcRenderer.send('remove-repos-cache')
                this.clearReposEntity.enabled = false
                this.clearReposEntity.message = 'Repositories cache cleared'
            }
        }
    }
</script>