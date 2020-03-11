<template>
  <div class="app-wrapper">
    <div class="main-container">
      <app-main/>
    </div>
    <Tabbar/>
  </div>
</template>

<script>
import { Tabbar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Tabbar,
    AppMain
  }
}
</script>
