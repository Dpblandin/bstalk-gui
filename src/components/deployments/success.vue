<template>
    <base-deployment :state="'Successfully deployed'"
                     :label-color="'green'"
                     :deployment="deployment">

    </base-deployment>
</template>
<script>
    import baseDeployment from './base.vue'
    export default{
        props: ['deployment'],
        components: { baseDeployment }
    }
</script>