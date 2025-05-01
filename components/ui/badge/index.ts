import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        success:
          'border-transparent bg-success text-white [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60',
        info: 'border-transparent bg-info text-white [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 dark:bg-info/60',
        warning:
          'border-transparent bg-warning text-white [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60',
        // Muted
        primaryMuted:
          'border-none bg-primary/25 text-primary [a&]:hover:bg-primary/90 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 ',
        destructiveMuted:
          'border-none bg-destructive/25 text-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ',
        successMuted:
          'border-none bg-success/25 text-success [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 ',
        infoMuted:
          'border-none bg-info/25 text-info [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 ',
        warningMuted:
          'border-none bg-warning/25 text-warning [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 ',
        // outline:
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
