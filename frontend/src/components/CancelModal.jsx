import React from "react";

const CancelModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Appointment</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 font-medium"
                    >
                        Keep Appointment
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 font-medium"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;
