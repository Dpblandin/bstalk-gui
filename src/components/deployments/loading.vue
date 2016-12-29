<template>
    <div>
        <div class="ui active inline small loader"></div>
        Deploying <strong>{{ deployment.repository.name }}</strong> on:
        <a :class="'ui ' + deployment.environment.color_label + ' label'">{{ deployment.environment.name }}</a>
    </div>
</template>
<script>
    export default{
        props: ['deployment']
    }
</script>