import { cn } from '~/lib/class-names'

type TitleProps = React.ComponentProps<'h1'>
export function Title({ className, ...props }: TitleProps) {
  return <h1 className={cn('text-3xl', className)} {...props} />
}
