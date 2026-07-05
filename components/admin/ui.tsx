// components/admin/ui.tsx
// Camada de compatibilidade: as páginas do admin usam estes nomes.
// A implementação real vive no Design System (components/ui).
import React from "react";

import {
  Button,
  Card,
  ConfirmDialog as UIConfirmDialog,
  Input,
  PageHeader,
  Select,
  Textarea,
  Toggle,
} from "@/components/ui";

export { StatusBadge } from "@/components/ui";

export const AdminPageHeader = PageHeader;

export const AdminInput = Input;
export const AdminTextarea = Textarea;
export const AdminSelect = Select;
export const AdminToggle = Toggle;

export const AdminButton = ({
  variant = "primary",
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button variant={variant} {...props} />
);

export const AdminCard = ({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <Card className={className} style={style}>
    {children}
  </Card>
);

export const ConfirmDialog = UIConfirmDialog;
