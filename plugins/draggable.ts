// https://github.com/SortableJS/vue.draggable.next
import VueDraggableNext from "vuedraggable"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("draggable", VueDraggableNext)
})
