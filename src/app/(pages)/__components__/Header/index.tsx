import { MdMenu } from "react-icons/md";
import UserDetails from "../UserDetails";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { API } from "@/utils/paths";
import { IGetCurrentUser } from "@/app/api/get-current-user/types";
import Skeleton from "@/components/Skeleton";

interface IHeaderProps {
  menuClick: () => void;
  label: string;
}

export default function Header({ menuClick, label }: IHeaderProps) {
  const { header, menu, title, content } = styles;
  const [user, setUser] = useState<IGetCurrentUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post(API.GET_CURRENT_USER).then((res) => setUser(res.data));
    setLoading(false);
  }, []);

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
