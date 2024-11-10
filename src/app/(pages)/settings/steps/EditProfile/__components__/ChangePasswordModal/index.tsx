import Input from "@/components/Input";
import Modal from "@/components/Modal";
import styles from "../../styles.module.scss";
import type { Control } from "react-hook-form";
import type { IModalDefaultProps } from "@/components/Modal/types";
import type { IEditProfileProps } from "../../types";

interface IChangePasswordModalProps extends IModalDefaultProps {
  okDisabled: boolean;
  loading: boolean;
  onSubmit: () => void;
  control: Control<IEditProfileProps>;
}
export default function ChangePasswordModal(props: IChangePasswordModalProps) {
  const { item } = styles;

  return (
    <Modal
      title="Change Password"
      hideCross
      open={props.open}
      onClose={props.onClose}
      onOk={props.onSubmit}
      okLoading={props.loading}
      okDisabled={props.okDisabled}
    >
      <form>
        <div className={item}>
          <label htmlFor="password">Password</label>
          <Input.Controlled
            control={props.control}
            name="password"
            id="password"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <div className={item}>
          <label htmlFor="confirmPassword"> Confirm password</label>
          <Input.Controlled
            control={props.control}
            name="confirmPassword"
            id="confirmPassword"
            type="password"
          />
        </div>
      </form>
    </Modal>
  );
}
