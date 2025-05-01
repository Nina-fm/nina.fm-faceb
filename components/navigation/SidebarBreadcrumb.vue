<script lang="ts" setup>
  const items = useBreadcrumbItems()
</script>

<template>
  <div class="flex items-center gap-5">
    <Breadcrumb class="tracking-wide [&_*]:text-[10px]">
      <BreadcrumbList>
        <template v-for="(item, index) in items" :key="index">
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <NuxtLink v-if="!item.current" :to="item.to">{{ item.label }}</NuxtLink>
              <BreadcrumbPage v-else>{{ item.label }}</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < items.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</template>
