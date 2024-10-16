import { MdMenu } from "react-icons/md";
import UserDetails from "../UserDetails";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { useAuth } from "@/store/useAuth";

interface IHeaderProps {
  menuClick: () => void;
  label: string;
}

export default function Header({ menuClick, label }: IHeaderProps) {
  const { header, menu, title, content } = styles;
  const { getUser, user, setValue } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await getUser();
      setValue("user", userData);
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