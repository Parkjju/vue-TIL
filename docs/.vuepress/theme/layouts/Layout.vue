<template>
    <ParentLayout>
        <Comment />
    </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';
import Comment from '@theme/components/Comment.vue';
console.log(ParentLayout);
console.log(Comment);

export default {
    components: {
        ParentLayout,
        Comment,
    },
};
</script>
