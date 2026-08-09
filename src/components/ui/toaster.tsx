import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const ToastComp = Toast as any
const ToastProviderComp = ToastProvider as any
const ToastTitleComp = ToastTitle as any
const ToastDescriptionComp = ToastDescription as any

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProviderComp>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastComp key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitleComp>{title}</ToastTitleComp>}
              {description && (
                <ToastDescriptionComp>{description}</ToastDescriptionComp>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastComp>
        )
      })}
      <ToastViewport />
    </ToastProviderComp>
  )
}
