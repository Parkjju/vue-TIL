<template>
    <ParentLayout>
        <template #page-bottom>
            <Comment />
        </template>
    </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';
import Comment from '../components/Comment.vue';
export default {
    components: {
        ParentLayout,
        Comment,
    },
};
</script>
