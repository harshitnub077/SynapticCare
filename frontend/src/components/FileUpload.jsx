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
        // Validate file type
        const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a PDF or image file (JPEG, PNG)");
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB");
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);

        // Create preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
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
                        accept=".pdf,image/*"
                        onChange={handleChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <p className="text-lg font-medium text-slate-700 mb-2">
                            Upload a medical document
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            Drag & drop a file here, or use the button below to choose from your computer.
                            Accepted formats: PDF, JPEG, PNG (max 10MB).
                        </p>
                        <button
                            type="button"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Choose File
                        </button>
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
