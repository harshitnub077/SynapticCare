import React, { useState, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

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
        // Validate file type - accept common image formats
        const validTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/bmp"
        ];
        
        // Also check file extension as fallback (some browsers may not set MIME type correctly)
        const fileName = file.name.toLowerCase();
        const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!validTypes.includes(file.type) && !hasValidExtension) {
            alert("Please upload a PDF or image file (JPEG, PNG, GIF, WebP, BMP). Your file type: " + (file.type || "unknown"));
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds the 10MB limit. Please choose a smaller file.`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);

        // Create preview for images
        if (file.type.startsWith("image/") || hasValidExtension) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.onerror = () => {
                console.error("Error reading file for preview");
                setPreview(null);
            };
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
            {!selectedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-300 hover:border-blue-400"
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
                        <div className="flex flex-col items-center">
                            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <p className="text-lg font-medium text-slate-700 mb-2">
                                Upload a Medical Report Photo or PDF
                            </p>
                            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
                                Take a photo of your report or upload from your computer.
                                <br />
                                <span className="font-medium">Accepted formats:</span> PDF, JPEG, PNG, GIF, WebP, BMP (max 10MB)
                            </p>
                            <button
                                type="button"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById("file-upload").click();
                                }}
                            >
                                Choose Photo or PDF
                            </button>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            {selectedFile.type === "application/pdf" ? (
                                <FileText className="h-12 w-12 text-blue-600" />
                            ) : (
                                <ImageIcon className="h-12 w-12 text-blue-600" />
                            )}
                            <div>
                                <p className="font-medium text-slate-900">{selectedFile.name}</p>
                                <p className="text-sm text-slate-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    {preview && (
                        <div className="mt-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
