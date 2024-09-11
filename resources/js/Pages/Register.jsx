import React, { useState } from 'react';
import { Head, useForm, usePage } from "@inertiajs/react";

export default function Register() {
    const { component } = usePage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="flex items-center justify-center">
            <Head title={component} />
            <form onSubmit={handleRegisterSubmit} className="max-w-md w-full bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <div className="flex flex-col space-y-4">
                    <label className="sr-only">Username</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Username"
                        className="w-full p-2 pl-10 text-sm text-gray-700"
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    <label className="sr-only">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        className="w-full p-2 pl-10 text-sm text-gray-700"
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    <label className="sr-only">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 pl-10 text-sm text-gray-700"
                    />
                    {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                    <label className="sr-only">Repeat Password</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Repeat Password"
                        className="w-full p-2 pl-10 text-sm text-gray-700"
                    />
                    {errors.password_confirmation && <div className="text-red-500 text-sm">{errors.password_confirmation}</div>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    {processing ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
