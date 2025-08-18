"use client";
import React from "react";
import { Button } from "@/components/elements/button";

interface ResourceLink {
  id?: number;
  label: string;
  url: string;
  password?: string | null;
}

interface HiddenResourcesProps {
  id: number;
  __component: string;
  title?: string;
  description?: string;
  locale: string;
}

import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export const HiddenResources: React.FC<HiddenResourcesProps> = ({ title, description, locale }) => {
  const { isAuthenticated, loginWithWeChat, loginWithQQ } = useAuth();
  const pathname = usePathname();
  const [links, setLinks] = useState<ResourceLink[]>([]);

  const slug = useMemo(() => {
    if (!pathname) return "";
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated || !slug) return;
    const fetchLinks = async () => {
      try {
        const res = await fetch(`/api/hidden-resources?slug=${encodeURIComponent(slug)}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setLinks(data?.links || []);
        }
      } catch {}
    };
    fetchLinks();
  }, [isAuthenticated, slug, locale]);

  if (!isAuthenticated) {
    return (
      <div className="relative rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
        <div className="absolute inset-0 backdrop-blur-[2px] rounded-xl" />
        <div className="relative">
          {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
          {description && (
            <p className="text-sm text-neutral-300 mb-4">{description}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="muted" onClick={loginWithWeChat}>使用微信登录查看</Button>
            <Button variant="muted" onClick={loginWithQQ}>使用QQ登录查看</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-sm text-neutral-300 mb-4">{description}</p>}
      <div className="space-y-3">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 bg-neutral-800/50 rounded-md px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">{link.label}</p>
              <p className="text-xs text-neutral-300 break-all">{link.url}</p>
              {link.password && (
                <p className="text-xs text-neutral-400">提取码: {link.password}</p>
              )}
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-white/90"
            >
              打开
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

