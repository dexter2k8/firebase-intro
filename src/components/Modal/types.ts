export interface IModalDefaultProps {
  open: boolean;
  onClose: () => void;
}
export interface IModal extends IModalDefaultProps {
  onOk?: () => void;
  leftIcon?: React.ReactNode;
  title?: string;
  description?: string;
  width?: string | number;
  hideCross?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  okText?: string;
  okLoading?: boolean;
  okDisabled?: boolean;
  cancelText?: string;
  children?: React.ReactNode;
}
