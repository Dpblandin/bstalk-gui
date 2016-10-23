<template>
    <div>
        <base-deployment :state="'Bypassed'" :deployment="deployment"></base-deployment>
        <file-diff v-if="hasChangedFiles" :files="changedFiles"></file-diff>
    </div>
</template>
<script type="text/ecmascript-6">
    import baseDeployment from './base.vue'
    import beanstalk from '../../services/api'
    import fileDiff from './diff/fileDiff.vue'
    import errorReporter from '../../mixins/errorReporter.vue'

    export default{
        props: ['deployment'],
        components: { baseDeployment, fileDiff },
        mixins: [errorReporter],
        data(){
          return {
              changedFiles: []
          }
        },
        computed: {
          hasChangedFiles() {
                return this.changedFiles.length > 0
            }
        },
        created() {
            beanstalk.changeSet(this.deployment.release.revision, this.deployment.repository.id, (err, res) => {
                if(err) {
                    this.reportError(err)
                }
                this.changedFiles = res.revision_cache.changed_files
            })
        }
    }
</script>