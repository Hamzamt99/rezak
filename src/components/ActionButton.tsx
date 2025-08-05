import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"

interface ActionButtonProps {
  onClick: () => void;
  icon: 'export' | 'import';
  label: string;
}

export const ActionButton = ({ onClick, icon, label }: ActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {icon === 'export' ? (
        <Download className="h-4 w-4" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      {label}
    </Button>
  )
}
