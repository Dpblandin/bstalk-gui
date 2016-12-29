<template>
    <div>
        <div class="ui segment">
            <form class="ui form">
                <h4 class="ui dividing header">Beanstalk settings</h4>
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
                <h4 class="ui dividing header">Ui preferences</h4>
                <div class="field">
                    <label>Theme</label>
                    <select v-model="newTheme" @change="saveUi" class="ui fluid dropdown">
                        <option v-for="(atheme, key) in themes"
                                :value="key"
                        :selected="key === newTheme">
                            {{ atheme }}
                        </option>
                    </select>
                </div>
                <button :disabled="!isValid"
                        @click="saveConfig"
                        class="ui primary button"
                        type="submit">
                    Save and close
                </button>
                <button :disabled="!clearReposEntity.enabled"
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
    import themes from '../constants/themes'
    import {ipcRenderer} from 'electron'
    import eventHub from '../events/hub'

    export default {
        props: ['account', 'username', 'token', 'theme'],
        data() {
            return {
                themes,
                newAccount: this.account,
                newUsername: this.username,
                newToken: this.token,
                newTheme: this.theme,

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

            saveUi(){
                const ui = {
                    theme: this.newTheme
                }
                ipcRenderer.send('ui-file-changed', ui)
            },

            clearReposCache() {
                ipcRenderer.send('remove-repos-cache')
                this.clearReposEntity.enabled = false
                this.clearReposEntity.message = 'Repositories cache cleared'
            }
        }
    }
</script>