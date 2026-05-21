"use client";

import { NEWS_SUBSCRIBE_OPEN_EVENT } from "@/components/NewsSubscribeDialog";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function NewsSubscribeTrigger({
  className = "btn btn-primary",
  children,
}: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent(NEWS_SUBSCRIBE_OPEN_EVENT))
      }
    >
      {children}
    </button>
  );
}
