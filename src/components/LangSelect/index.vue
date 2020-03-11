<template>
  <div class="lang-area">
    <div @click.stop="handleSetLanguage">{{ language == 'zh' ? $t('login.wei') : $t('login.zh') }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage() {
      let lang = ''
      if (this.language === 'wei') {
        lang = 'zh'
      } else {
        lang = 'wei'
      }
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)

      if (this.language === 'wei') {
        this.$toast.success('تىل ئالماشتۇرۇش مۇۋەپپەقىيەتلىك بولدى')
      }
      if (this.language === 'zh') {
        this.$toast.success('语言切换成功')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lang-area {
  font-size: 18px;
  text-align: right;
}
</style>
