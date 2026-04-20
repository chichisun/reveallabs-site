"use client";

import { WAITLIST_OPEN_EVENT } from "./WaitlistDialog";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function WaitlistTrigger({ className = "btn btn-primary", children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent(WAITLIST_OPEN_EVENT))
      }
    >
      {children}
    </button>
  );
}
