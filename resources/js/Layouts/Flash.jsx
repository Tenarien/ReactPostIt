import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Inertia } from "@inertiajs/inertia";

export default function Flash() {
    Inertia.on("success", (event) => {
        const props = event.detail.page.props;

        if (props.flash) {
            if (props.flash.success) {
                toast.success(props.flash.success, {
                    icon: <AiOutlineCheckCircle className="text-orange-500 w-8 h-8" />,
                    autoClose: 3000,
                });
            }
            if (props.flash.error) {
                toast.error(props.flash.error, {
                    icon: <AiOutlineCloseCircle className="text-red-500 w-8 h-8" />,
                    autoClose: 3000,
                });
            }

            // Clear the flash message to prevent duplicates
            delete props.flash;
        }
    });

    return (
        <ToastContainer
            closeButton={false}
            hideProgressBar={true}
            newestOnTop={true}
            draggable={false}
            toastClassName={(context) =>
                `${
                    context?.type === "success"
                        ? "bg-white text-orange-500"
                        : context?.type === "error"
                            ? "bg-white text-red-500"
                            : "bg-white text-orange-500"
                } flex items-center justify-between gap-2 p-2 mt-2 mr-2 rounded-lg shadow-lg  border border-orange-500`
            }
            bodyClassName="text-sm font-medium"
        />
    );
}
