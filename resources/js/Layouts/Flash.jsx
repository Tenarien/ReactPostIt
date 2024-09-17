import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function Flash() {
    const { flash } = usePage().props; // Get the flash object from props
    const [visible, setVisible] = useState(false); // Controls the visibility
    const [isDisplayed, setIsDisplayed] = useState(false); // Controls DOM presence
    const [currentMessage, setCurrentMessage] = useState(''); // Stores the current message
    const [messageType, setMessageType] = useState(''); // Stores the type of message (success, error, etc.)

    useEffect(() => {
        if (flash.success || flash.error || flash.message) {

            if (flash.success) {
                setCurrentMessage(flash.success);
                setMessageType('success');
            } else if (flash.error) {
                setCurrentMessage(flash.error);
                setMessageType('error');
            } else if (flash.message) {
                setCurrentMessage(flash.message);
                setMessageType('message');
            }


            setIsDisplayed(true);
            setVisible(true);


            const timer = setTimeout(() => {
                setVisible(false);

                const removeTimer = setTimeout(() => {
                    setIsDisplayed(false);
                }, 500);
                return () => clearTimeout(removeTimer);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!isDisplayed || !currentMessage) return null;

    const getBackgroundColor = () => {
        switch (messageType) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-zinc-500';
        }
    };

    return (
        <div
            className={`fixed z-50 w-fit bottom-4 right-4 px-4 py-2 m-4 rounded-lg text-white transform duration-1000 transition-all ease-in-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'} ${getBackgroundColor()}`}
        >
            <p className="font-bold">{currentMessage}</p>
        </div>
    );
}
