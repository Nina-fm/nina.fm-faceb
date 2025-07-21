import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        success: 'text-success bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-success/90',
        info: 'text-info bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-info/90',
        warning: 'text-warning bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-warning/90',
        muted: 'bg-muted text-muted-foreground',
        primaryMuted: 'text-primary bg-primary/20 [&>svg]:text-current *:data-[slot=alert-description]:text-primary/90',
        destructiveMuted:
          'text-destructive bg-destructive/20 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        successMuted: 'text-success bg-success/20 [&>svg]:text-current *:data-[slot=alert-description]:text-success/90',
        infoMuted: 'text-info bg-info/20 [&>svg]:text-current *:data-[slot=alert-description]:text-info/90',
        warningMuted: 'text-warning bg-warning/20 [&>svg]:text-current *:data-[slot=alert-description]:text-warning/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
