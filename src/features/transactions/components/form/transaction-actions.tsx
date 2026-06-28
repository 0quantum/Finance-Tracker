"use client";

import { MessageSquare, Calendar, Settings } from "lucide-react";
import { IconButton } from "../icon-button";

type TransactionActionsProps = {
  visible: boolean;
  onOpenDetails: () => void;
  onOpenDatePicker: () => void;
  onOpenSettings: () => void;
};

export function TransactionActions({
  visible,
  onOpenDetails,
  onOpenDatePicker,
  onOpenSettings,
}: TransactionActionsProps) {
  return (
    <div
      className={`
        flex items-center gap-2 overflow-hidden
        transition-all duration-300 ease-out
        ${visible ? "max-w-[136px] opacity-100" : "max-w-0 opacity-0"}
      `}
    >
      <IconButton
        aria-label="Add transaction details"
        tabIndex={visible ? 0 : -1}
        onClick={onOpenDetails}
      >
        <MessageSquare className="h-4 w-4" />
      </IconButton>

      <IconButton
        aria-label="Pick transaction date"
        tabIndex={visible ? 0 : -1}
        onClick={onOpenDatePicker}
      >
        <Calendar className="h-4 w-4" />
      </IconButton>

      <IconButton
        aria-label="Transaction settings"
        tabIndex={visible ? 0 : -1}
        onClick={onOpenSettings}
      >
        <Settings className="h-4 w-4" />
      </IconButton>
    </div>
  );
}