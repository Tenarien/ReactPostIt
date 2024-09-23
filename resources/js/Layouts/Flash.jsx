import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function Flash() {
    const { flash } = usePage().props;
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


    const getBorderColor = () => {
        switch (messageType) {
            case 'success':
                return 'border-orange-500';
            case 'error':
                return `border-red-500 text-red-500`;
        }
    };

    return (
        <div
            className={`fixed z-50 w-fit bottom-4 right-4 px-4 py-2 m-4 border
             rounded-lg bg-white text-orange-500 transform duration-300 transition-all ease-in-out

             ${getBorderColor()}
             ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
            <p className="font-bold">{currentMessage}</p>
        </div>
    );
}
