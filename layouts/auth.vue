<script lang="ts" setup></script>

<template>
  <div class="nina-layout full-height">
    <el-container>
      <el-main class="n-main">
        <el-row justify="center">
          <el-col>
            <slot />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.n-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
