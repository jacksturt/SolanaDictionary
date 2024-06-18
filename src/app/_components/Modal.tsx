import {
  FC,
  ReactNode,
  HTMLAttributes,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { useOutsideAlerter } from "~/hooks/useOutsideAlerter";
import Close from "~/app/_components/icons/close";
import { motion } from "framer-motion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  disableOutsideClick?: boolean;
}
const Modal: FC<Props> = (props: Props) => {
  const {
    setShowModal,
    disableOutsideClick = false,
    children,
    className,
    ...componentProps
  } = props;

  const wrapperRef = useRef(null);
  useOutsideAlerter(
    wrapperRef,
    () => !disableOutsideClick && setShowModal(false),
  );

  return (
    <motion.div
      key="image-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
      className="fixed inset-0 z-50 h-screen w-screen bg-black/30 backdrop-blur-sm"
      onClick={componentProps.onClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-neutral100 3xl:w-[70vh] absolute left-1/2
          top-1/2 max-h-[90vh] w-[90%] -translate-x-1/2
          -translate-y-1/2 transform overflow-y-auto overflow-x-hidden rounded-md
          p-5 lg:w-[100vh] ${className}`}
        ref={wrapperRef}
      >
        <div
          className="fixed right-5 top-5 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <Close className="h-5 w-5 fill-black" />
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export default Modal;
