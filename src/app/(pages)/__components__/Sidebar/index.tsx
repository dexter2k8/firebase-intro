import Link from "next/link";
import { MdDashboard, MdLogout, MdOutlineSettings, MdOutlineTableChart } from "react-icons/md";
import Logo from "../../../../../public/assets/logo";
import styles from "./styles.module.scss";
import { auth } from "@/services/firebase";

const sidebarItems = [
  { label: "Dashboard", value: "/dashboard", icon: <MdDashboard /> },
  { label: "Analytics", value: "/analytics", icon: <MdOutlineTableChart /> },
  { label: "Settings", value: "/settings", icon: <MdOutlineSettings /> },
];

interface ISidebarProps {
  collapsed: boolean;
  pathname: string;
}

export default function Sidebar({ collapsed, pathname }: ISidebarProps) {
  const { sidebar, head, items, foot } = styles;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={sidebar} data-collapsed={collapsed}>
      <div className={head}>
        <Link href="/dashboard">
          <Logo />
          <span>Funds Explorer</span>
        </Link>
      </div>

      <ul className={items}>
        {sidebarItems.map((item, i) => (
          <li key={i} data-active={pathname === item.value}>
            <Link href={item.value}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={foot}>
        <Link href="/" onClick={handleSignOut}>
          <MdLogout />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
