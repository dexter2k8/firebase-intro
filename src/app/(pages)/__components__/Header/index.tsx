import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import Skeleton from "@/components/Skeleton";
import { useAuth } from "@/store/useAuth";
import UserDetails from "../UserDetails";
import styles from "./styles.module.scss";
import type { IGetCurrentUser } from "@/store/useAuth/types";

interface IHeaderProps {
  menuClick: () => void;
  label: string;
}

export default function Header({ menuClick, label }: IHeaderProps) {
  const { header, menu, title, content } = styles;
  const { getUser, setValue } = useAuth();
  const [user, setUser] = useState<IGetCurrentUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await getUser();
      setValue("userId", userData?.uid);
      setValue("isAdmin", userData?.role === "admin");
      setUser(userData);
      setLoading(false);
    };
    getUserData();
  }, [getUser, setValue]);

  return (
    <header className={header}>
      <div className={content}>
        <div className={menu}>
          <button onClick={menuClick}>
            <MdMenu />
          </button>
          <h2 className={title}>{label}</h2>
        </div>
        {loading ? (
          <Skeleton.Circle width="2.5rem" />
        ) : (
          user && <UserDetails username={user?.name} email={user?.email} avatar={user?.avatar} />
        )}
      </div>
    </header>
  );
}
