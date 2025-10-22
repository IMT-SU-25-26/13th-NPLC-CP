"use client";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutConfirmation({
    isOpen,
    onClose,
    onConfirm,
}: LogoutConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000] pointer-events-auto">
            <div className="bg-[#1a1a1a] border-2 border-[#FCF551] rounded-lg p-8 max-w-md mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-[#FCF551]">
                    Konfirmasi Logout
                </h2>
                <p className="mb-6 text-gray-300 text-lg">
                    Apakah Anda yakin ingin keluar dari akun Anda?
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Ya, Logout
                    </button>
                </div>
            </div>
        </div>
    );
}