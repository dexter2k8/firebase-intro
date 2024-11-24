"use client";
import Tabs from "@/components/Tabs";
import { useAuth } from "@/store/useAuth";
import EditProfile from "./steps/EditProfile";
import { ManageFunds } from "./steps/ManageFunds";
import { ManageUsers } from "./steps/ManageUsers";
import styles from "./styles.module.scss";
import type { ITabItemProps } from "@/components/Tabs";

export default function Settings() {
  const { settings } = styles;
  const { isAdmin } = useAuth();

  const tabItems: ITabItemProps[] = [
    { key: 0, label: "Edit profile", children: <EditProfile /> },
    { key: 1, label: "Manage Funds", children: <ManageFunds /> },
  ];
  if (isAdmin) tabItems.push({ key: 2, label: "Manage Users", children: <ManageUsers /> });

  return (
    <div className={settings}>
      <main>
        <Tabs items={tabItems} minWidth="25rem" />
      </main>
    </div>
  );
}
