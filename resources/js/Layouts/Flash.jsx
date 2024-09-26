import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flash() {
    const { flash } = usePage().props;
    const { url } = usePage()
    const [visible, setVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (flash.success || flash.error) {
            if (flash.success) {
                setCurrentMessage(flash.success);
                setMessageType('success');
            } else if (flash.error) {
                setCurrentMessage(flash.error);
                setMessageType('error');
            }

            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);


            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [url]);


    const getBorderColor = () => {
        switch (messageType) {
            case 'success':
                return 'border-orange-500';
            case 'error':
                return `border-red-500 text-red-500`;
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={`fixed z-50 w-fit bottom-4 right-4 px-4 py-2 m-4 border rounded-lg bg-white text-orange-500 ${getBorderColor()}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <p className="font-bold">{currentMessage}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
