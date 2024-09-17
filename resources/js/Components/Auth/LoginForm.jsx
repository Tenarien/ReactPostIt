import React, {useEffect, useState} from 'react';
import {Link, useForm, usePage} from "@inertiajs/react";

function LoginForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const { props } = usePage();
    const [showLoginForm, setShowLoginForm] = useState(false);

    useEffect(() => {
        setShowLoginForm(props.showLoginForm || false);
    }, [props.showLoginForm]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        post('/login');
    }


    return (
        <div>
            {/* Toggle Button */}
            <button
                onClick={() => setShowLoginForm(!showLoginForm)}
                className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ${showLoginForm ? 'hidden' : 'block'}`}
            >
                {showLoginForm ? '' : 'Login'}
            </button>

            {/* Modal Overlay for Login Form */}
            {showLoginForm && (
                <div
                    className="bg-black bg-opacity-70 fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <button
                                className="text-black text-center text-3xl rounded-full px-2 hover:bg-black hover:bg-opacity-30"
                                onClick={() => setShowLoginForm(false)}
                            >
                                &times;
                            </button>
                            <p className="text-black text-xl font-bold pr-6">Login</p>
                        </div>
                        <div className="py-4 px-6">
                            <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email"
                                    className="w-full p-2 pl-10 text-sm text-gray-700 border"
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="w-full p-2 pl-10 text-sm text-gray-700 border"
                                />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {processing ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                            <Link
                                onClick={() => setShowLoginForm(false)}
                                href={`/register`}
                            >
                                <p className="text-sm text-center text-gray-500 hover:text-black mt-4">
                                    Don't have an account yet?
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
