<!--
Based on the codebase from the official vuepress search plugin as of 27.01.2020
https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/plugin-search
 -->

<template>
    <div class="search-box">
        <input
                ref="input"
                aria-label="Search"
                :value="query"
                :class="{ 'focused': focused }"
                :placeholder="placeholder"
                autocomplete="off"
                spellcheck="false"
                @input="query = $event.target.value"
                @focus="focused = true"
                @blur="focused = false"
                @keyup.enter="go(focusIndex)"
                @keyup.up="onUp"
                @keyup.down="onDown"
        >
        <ul
                v-if="showSuggestions"
                class="suggestions"
                :class="{ 'align-right': alignRight }"
                @mouseleave="unfocus"
        >
            <li
                    v-for="(s, i) in suggestions"
                    :key="i"
                    class="suggestion"
                    :class="{ focused: i === focusIndex }"
                    @mousedown="go(i)"
                    @mouseenter="focus(i)"
            >
                <a
                        :href="s.sectionSlug"
                        @click.prevent
                >
                    <span class="page-title">{{ s.pageTitle || s.sectionSlug }}</span>
                    <span
                            v-if="s.sectionHeader"
                            class="header"
                    >&gt; {{ s.sectionHeader }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    /* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS, SEARCH_HOTKEYS */
    const lunr = require('lunr');
    export default {
        name: 'LunarSearch',

        data() {
            return {
                query: '',
                focused: false,
                focusIndex: 0,
                placeholder: undefined
            }
        },

        computed: {
            showSuggestions() {
                return (
                    this.focused
                    && this.suggestions
                    && this.suggestions.length
                )
            },

            suggestions() {
                const query = this.query.trim().toLowerCase() + '*';
                if (!query || query === '*') {
                    return
                }

                let max = SEARCH_MAX_SUGGESTIONS;
                if (max < 1) max = 5;
                const idx = lunr(function () {
                    this.ref('sectionSlug');
                    this.field('sectionContent');
                    this.field('sectionHeader');

                    DOCUMENTS.forEach(function (doc) {
                        this.add(doc)
                    }, this)
                });

                const results = idx.search(query);
                let returnArray = [];
                if(max > results.length) max = results.length;
                results.splice(max, results.length - max);

                for (let currentResult of results) {
                    returnArray.push(DOCUMENTS.find(x => x.sectionSlug === currentResult.ref));
                }

                return returnArray
            },

            // make suggestions align right when there are not enough items
            alignRight() {
                const navCount = (this.$site.themeConfig.nav || []).length;
                const repo = this.$site.repo ? 1 : 0;
                return navCount + repo <= 2;
            }
        },


        mounted() {
            this.placeholder = this.$site.themeConfig.searchPlaceholder || ''
            document.addEventListener('keydown', this.onHotkey)
        },

        beforeDestroy() {
            document.removeEventListener('keydown', this.onHotkey)
        },

        methods: {
            getPageLocalePath(page) {
                for (const localePath in this.$site.locales || {}) {
                    if (localePath !== '/' && page.path.indexOf(localePath) === 0) {
                        return localePath
                    }
                }
                return '/'
            },

            isSearchable(page) {
                let searchPaths = SEARCH_PATHS

                // all paths searchables
                if (searchPaths === null) {
                    return true
                }

                searchPaths = Array.isArray(searchPaths) ? searchPaths : new Array(searchPaths)

                return searchPaths.filter(path => {
                    return page.path.match(path)
                }).length > 0
            },

            onHotkey(event) {
                if (event.srcElement === document.body && SEARCH_HOTKEYS.includes(event.key)) {
                    this.$refs.input.focus()
                    event.preventDefault()
                }
            },

            onUp() {
                if (this.showSuggestions) {
                    if (this.focusIndex > 0) {
                        this.focusIndex--
                    } else {
                        this.focusIndex = this.suggestions.length - 1
                    }
                }
            },

            onDown() {
                if (this.showSuggestions) {
                    if (this.focusIndex < this.suggestions.length - 1) {
                        this.focusIndex++
                    } else {
                        this.focusIndex = 0
                    }
                }
            },

            go(i) {
                if (!this.showSuggestions) {
                    return
                }
                this.$router.push(this.suggestions[i].sectionSlug)
                this.query = ''
                this.focusIndex = 0
            },

            focus(i) {
                this.focusIndex = i
            },

            unfocus() {
                this.focusIndex = -1
            }
        }
    }
</script>

<style lang="stylus">
    .search-box
        display inline-block
        position relative
        margin-right 1rem

        input
            cursor text
            width 20rem
            height: 2rem
            color lighten($textColor, 25%)
            display inline-block
            border 1px solid darken($borderColor, 10%)
            border-radius 2rem
            font-size 0.9rem
            line-height 2rem
            padding 0 0.5rem 0 2rem
            outline none
            transition all .2s ease
            /*background #fff url(search.svg) 0.6rem 0.5rem no-repeat*/
            background-size 1rem

            &:focus
                cursor auto
                border-color $accentColor

        .suggestions
            background #fff
            width 20rem
            position absolute
            top 1.5rem
            border 1px solid darken($borderColor, 10%)
            border-radius 6px
            padding 0.4rem
            list-style-type none

            &.align-right
                right 0

        .suggestion
            line-height 1.4
            padding 0.4rem 0.6rem
            border-radius 4px
            cursor pointer

            a
                white-space normal
                color lighten($textColor, 35%)

                .page-title
                    font-weight 600

                .header
                    font-size 0.9em
                    margin-left 0.25em

            &.focused
                background-color #f3f4f5

                a
                    color $accentColor

    @media (max-width: $MQNarrow)
        .search-box
            input
                cursor pointer
                width 0
                border-color transparent
                position relative

                &:focus
                    cursor text
                    left 0
                    width 10rem

    // Match IE11
    @media all and (-ms-high-contrast: none)
        .search-box input
            height 2rem

    @media (max-width: $MQNarrow) and (min-width: $MQMobile)
        .search-box
            .suggestions
                left 0

    @media (max-width: $MQMobile)
        .search-box
            margin-right 0

            input
                left 1rem

            .suggestions
                right 0

    @media (max-width: $MQMobileNarrow)
        .search-box
            .suggestions
                width calc(100vw - 4rem)

            input:focus
                width 8rem
</style>
