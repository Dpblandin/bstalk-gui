<template>
    <div>
        <base-deployment :state="'Bypassed'" :deployment="deployment"></base-deployment>
    </div>
</template>

<script type="text/ecmascript-6">
    import baseDeployment from './base.vue'

    export default{
        props: ['deployment'],
        components: { baseDeployment }
    }
</script>