import React, { useState, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FileUpload = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const validTypes = [
            "application/pdf", "image/jpeg", "image/jpg", 
            "image/png", "image/gif", "image/webp", "image/bmp"
        ];
        
        const fileName = file.name.toLowerCase();
        const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!validTypes.includes(file.type) && !hasValidExtension) {
            alert("Format not supported. Please upload a PDF or Image.");
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert(`File size exceeds 10MB limit. Yours: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);

        if (file.type.startsWith("image/") || hasValidExtension) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.onerror = () => setPreview(null);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreview(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="upload-box"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ease-out backdrop-blur-md ${dragActive
                                ? "border-white bg-zinc-900/80 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                : "border-zinc-800 hover:border-zinc-600 bg-zinc-950/50 hover:bg-zinc-900/80"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*"
                            onChange={handleChange}
                            capture="environment"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                            <motion.div 
                                className="flex flex-col items-center"
                                animate={dragActive ? { y: -5 } : { y: 0 }}
                            >
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 border ${dragActive ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-display">
                                    Drop your medical record here
                                </h3>
                                <p className="text-sm text-zinc-500 mb-8 max-w-sm">
                                    Upload PDFs or high-quality photos of your reports. Our AI will automatically extract and analyze the clinical metrics.
                                </p>
                                <button
                                    type="button"
                                    className="btn-medical-secondary bg-white text-black border-transparent hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById("file-upload").click();
                                    }}
                                >
                                    Browse Files
                                </button>
                                <p className="text-xs font-semibold text-zinc-600 mt-6 tracking-wide uppercase">
                                    Supports PDF, JPG, PNG up to 10MB
                                </p>
                            </motion.div>
                        </label>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="preview-box"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="medical-card border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 bg-zinc-900/50 backdrop-blur-xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                    {selectedFile.type === "application/pdf" ? (
                                        <FileText className="h-7 w-7 text-white" />
                                    ) : (
                                        <ImageIcon className="h-7 w-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                                    <p className="text-sm text-zinc-400 font-medium">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Parse
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-950/50 hover:text-rose-400 transition-colors border border-transparent hover:border-red-900"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {preview && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950"
                            >
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-[300px] mx-auto object-contain"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold leading-none bg-black/60 backdrop-blur-md text-white shadow-sm border border-zinc-700 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-emerald-400" /> Scanning Matrix
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;
