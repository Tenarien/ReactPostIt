import {motion} from "framer-motion";
import {useForm} from "@inertiajs/react";

function EditProfileForm({ user, isEditing, isCurrentUser, onCompleteEdit }) {
    const expandVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1 },
    };

    const { data, setData, put: put, errors, processing, reset } = useForm({
        name: user.name,
        email: user.email,
        bio: user.bio,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/profile/update/${user.id}`, {
            preserveScroll: true,
            onSuccess: (response) => {
                  onCompleteEdit();
            },
        });
    }

    return (
        <>
            {isCurrentUser && isEditing && (
                <motion.div
                    className="overflow-hidden"
                    initial="hidden"
                    animate={isEditing ? "visible" : "hidden"}
                    variants={expandVariants}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="p-6 bg-gray-50">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={data.name || ""}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        />
                                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email || ""}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        />
                                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                                    <textarea
                                        rows="4"
                                        value={data.bio || ""}  // Use data.bio to bind the value to the form state
                                        onChange={(e) => setData('bio', e.target.value)}  // Update the form state on change
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    {errors.bio && <span className="text-red-500 text-sm">{errors.bio}</span>}
                                </div>

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600 transition-all duration-300"
                                        disabled={processing}
                                    >
                                        {processing ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default EditProfileForm;
