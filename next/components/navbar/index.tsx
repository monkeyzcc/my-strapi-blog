"use client";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { motion } from "framer-motion";


export function Navbar({ data, locale }: { data: any, locale: string }) {
  const leftNavbarItems = [
    { text: '首页', URL: '' },
    { text: '资源分享文章', URL: '/blog' },
    { text: '教程文章', URL: '/blog' },
    { text: '商品', URL: '/products' },
  ];
  return (
    <motion.nav
      className="max-w-7xl  fixed top-4  mx-auto inset-x-0 z-50 w-[95%] lg:w-full"
    >
      <div className="hidden lg:block w-full">
        <DesktopNavbar locale={locale} leftNavbarItems={leftNavbarItems} rightNavbarItems={[]} logo={data?.logo} />

      </div>
      <div className="flex h-full w-full items-center lg:hidden ">
        <MobileNavbar locale={locale} leftNavbarItems={leftNavbarItems} rightNavbarItems={[]} logo={data?.logo} />
      </div>
    </motion.nav>
  );
}