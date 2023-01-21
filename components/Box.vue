<script lang="ts" setup></script>

<template>
  <div class="n-box">
    <header class="n-box-title">
      <slot name="title">Title</slot>
    </header>
    <div class="n-box-main">
      <slot />
    </div>
    <footer class="n-box-actions">
      <slot name="actions">Footer</slot>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.n-box {
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow);
  width: 30vw;
  min-width: 300px;
  font-size: var(--el-font-size-base);
}

.n-box-title {
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  padding-bottom: 10px;
  line-height: var(--el-font-line-height-primary);
  font-size: var(--el-font-size-large);
  color: var(--el-text-color-primary);
  border-radius: var(--el-border-radius-small);
}

.n-box-main {
  padding: 30px 20px;
}

.n-box-actions {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  padding-top: 10px;
}
</style>
