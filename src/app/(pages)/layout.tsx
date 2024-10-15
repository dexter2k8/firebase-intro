"use client";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/(pages)/__components__/Sidebar";
import Header from "./__components__/Header";
import styles from "./styles.module.scss";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { layout, container, content } = styles;
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const title = pathname.split("/")[1].toUpperCase();

  return (
    <div className={layout}>
      <Sidebar pathname={pathname} collapsed={collapsed} />
      <div className={container}>
        <Header label={title} menuClick={() => setCollapsed(!collapsed)} />
        <div className={content}>{children}</div>
      </div>
    </div>
  );
}
