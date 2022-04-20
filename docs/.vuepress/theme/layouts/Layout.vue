<template>
    <ParentLayout>
        <Comment />
    </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';
import Comment from '@theme/components/Comment.vue';

export default {
    components: {
        ParentLayout,
        Comment,
    },
};
</script>
