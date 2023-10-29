import type { TitleProps } from './title'
import { Title } from './title'
import { cn } from '~/lib/class-names'

export function SectionTitle({ className, ...props }: TitleProps) {
  return <Title className={cn('text-accent text-[16px] font-semibold', className)} {...props} />
}
