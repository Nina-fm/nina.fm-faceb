import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        success: 'bg-success text-success-foreground shadow-xs hover:bg-success/80',
        warning: 'bg-warning text-warning-foreground shadow-xs hover:bg-warning/80',
        info: 'bg-info text-info-foreground shadow-xs hover:bg-info/80',
        // outline
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        primaryOutline: 'border border-primary/40 bg-primary/10 text-primary shadow-xs hover:bg-primary/20 ',
        secondaryOutline: 'border border-secondary/40 bg-secondary/10 text-secondary shadow-xs hover:bg-secondary/20 ',
        successOutline: 'border border-success/40 bg-success/10 text-success shadow-xs hover:bg-success/20 ',
        warningOutline: 'border border-warning/40 bg-warning/10 text-warning shadow-xs hover:bg-warning/20 ',
        infoOutline: 'border border-info/40 bg-info/10 text-info shadow-xs hover:bg-info/20 ',
        destructiveOutline:
          'border border-destructive/40 bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 ',
        // ghost
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        primaryGhost: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20',
        secondaryGhost: 'text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20',
        successGhost: 'text-success hover:bg-success/10 dark:hover:bg-success/20',
        warningGhost: 'text-warning hover:bg-warning/10 dark:hover:bg-warning/20',
        infoGhost: 'text-info hover:bg-info/10 dark:hover:bg-info/20',
        destructiveGhost: 'text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20',
        // muted
        muted: 'bg-muted/10 text-muted-foreground/80 shadow-xs hover:bg-muted/20',
        primaryMuted: 'bg-primary/10 text-primary shadow-xs hover:bg-primary/20',
        secondaryMuted: 'bg-secondary/10 text-secondary shadow-xs hover:bg-secondary/20',
        successMuted: 'bg-success/10 text-success shadow-xs hover:bg-success/20',
        warningMuted: 'bg-warning/10 text-warning shadow-xs hover:bg-warning/20',
        infoMuted: 'bg-info/10 text-info shadow-xs hover:bg-info/20',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9 rounded-full',
        fab: "size-10 rounded-full [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
