import Image from "next/image";
import { MdOutlinePerson } from "react-icons/md";
import styles from "./styles.module.scss";

interface IUserDetailsProps {
  avatar?: string;
  username?: string;
  email: string;
}

export default function UserDetails({ avatar, username, email }: IUserDetailsProps) {
  return (
    <div
      className={styles.userDetails}
      onMouseEnter={(e) => e.currentTarget.classList.add(styles.show)}
      onMouseLeave={(e) => e.currentTarget.classList.remove(styles.show)}
    >
      <figure>
        {avatar ? (
          <Image src={avatar} alt="avatar" width={40} height={40} />
        ) : (
          <MdOutlinePerson size={40} />
        )}
      </figure>
      <section>
        <div>
          {username && <h4>{username}</h4>}
          <p>{email}</p>
        </div>
      </section>
    </div>
  );
}
