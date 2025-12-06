import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const showAlert = ({
  type = "info",
  title = "",
  text = "",
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
}) => {
  MySwal.fire({
    title,
    text,
    icon: type === "confirmation" ? "question" : type,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    showCancelButton: showCancel || type === "confirmation",
    customClass: {
      popup: "!rounded-2xl !bg-white dark:!bg-gray-900 !shadow-lg",
      title: "!text-brand-primary dark:!text-white !font-bold",
      confirmButton:
        "!bg-brand-primary !text-white !rounded-lg !px-6 !py-2 !font-semibold",
      cancelButton:
        "!bg-gray-300 !text-gray-800 !rounded-lg !px-6 !py-2 !font-semibold",
      content: "!text-gray-700 dark:!text-gray-200",
    },
    background: "#fff",
    buttonsStyling: false,
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed && onConfirm) onConfirm();
    if (result.isDismissed && onCancel) onCancel();
  });
};

export default showAlert;
