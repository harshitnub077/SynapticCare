import React from "react";
import { X, AlertCircle, ShieldAlert, ChevronRight } from "lucide-react";

const CancelModal = ({ onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-nexus-primary/60 backdrop-blur-2xl animate-in fade-in duration-700"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl nexus-glass-heavy bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-12 border-white/80 animate-in zoom-in-95 duration-500 text-center">
                <button
                    onClick={onClose}
                    className="absolute right-10 top-10 text-nexus-text-muted hover:text-nexus-primary transition-all"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-2 border-red-100 shadow-xl shadow-red-500/10 scale-in">
                    <ShieldAlert className="w-12 h-12" />
                </div>

                <h3 className="text-4xl font-black text-nexus-primary tracking-tighter mb-6">Link Termination.</h3>

                <p className="text-nexus-text-muted text-lg font-medium leading-relaxed mb-12">
                    Are you certain you wish to purge this session link?
                    This action will permanently terminate the clinical coordination
                    and recalibrate the specialist matrix.
                </p>

                <div className="flex flex-col gap-5 stagger-in">
                    <button
                        onClick={onConfirm}
                        className="w-full btn-nexus bg-red-600 hover:bg-red-700 shadow-red-600/20 py-6 text-xs tracking-[0.3em] group"
                    >
                        <div className="flex items-center justify-center gap-3">
                            Confirm Termination
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                        </div>
                    </button>
                    <button
                        onClick={onClose}
                        className="btn-nexus-outline py-6"
                    >
                        Retain Clinical Link
                    </button>
                </div>

                <p className="mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
                    End-to-End Verification Protocol v5.0
                </p>
            </div>
        </div>
    );
};

export default CancelModal;
