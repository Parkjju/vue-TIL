<template lang="html">
    <div>
        <span v-for="tag in Object.keys(tags)">
            <h3 :id="tag">
                <router-link
                    :to="{ path: `/tags.html#${tag}` }"
                    class="header-anchor"
                    aria-hidden="true"
                    >#</router-link
                >
                {{ tag }}
            </h3>
            <ul>
                <li v-for="page in tags[tag]">
                    <router-link :to="{ path: page.path }">{{
                        page.title
                    }}</router-link>
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    computed: {
        tags() {
            let tags = {};
            for (let page of this.$site.pages) {
                for (let index in page.frontmatter.tags) {
                    const tag = page.frontmatter.tags[index];
                    if (tag in tags) {
                        tags[tag].push(page);
                    } else {
                        tags[tag] = [page];
                    }
                }
            }
            return tags;
        },
    },
};
</script>
