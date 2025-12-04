import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, Loader, FileText } from "lucide-react";
import api from "../api/axiosConfig";

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const response = await api.get(`/reports/${id}`);
            setReport(response.data.report);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else {
                setError("Failed to load report");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 text-red-800 p-4 rounded-md">
                        {error || "Report not found"}
                    </div>
                </div>
            </div>
        );
    }

    const abnormalities = report.flags?.abnormalities || [];
    const aiInsights = report.flags?.aiInsights;

    // Debug logging
    console.log('[ReportDetail] Report data:', {
        id: report.id,
        status: report.status,
        hasFlags: !!report.flags,
        hasAbnormalities: !!abnormalities.length,
        hasAIInsights: !!aiInsights,
        aiInsightsSummaryLength: aiInsights?.summary?.length || 0,
        flagsStructure: report.flags
    });

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={() => navigate("/reports")}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Reports
                </button>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <FileText className="h-12 w-12 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{report.filename}</h1>
                                <p className="text-slate-600 mt-1">
                                    Uploaded {new Date(report.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${report.status === "done"
                                ? "bg-green-100 text-green-800"
                                : report.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                        >
                            {report.status}
                        </span>
                    </div>
                </div>

                {/* Report Summary */}
                {report.status === "processing" ? (
                    <div className="bg-blue-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <Loader className="h-6 w-6 text-blue-600 animate-spin" />
                            <div>
                                <h2 className="text-lg font-semibold text-blue-900">Processing Report...</h2>
                                <p className="text-sm text-blue-700 mt-1">
                                    Our AI is analyzing your medical report. This usually takes 10-30 seconds.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchReport}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Check Status
                        </button>
                    </div>
                ) : report.status === "error" ? (
                    <div className="bg-red-50 rounded-lg shadow-sm p-6 mb-6 border border-red-200">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                            <div>
                                <h2 className="text-lg font-semibold text-red-900">Processing Error</h2>
                                <p className="text-sm text-red-700 mt-1">
                                    {report.extractedText || "There was an error processing your report. The image may be unclear or the format may not be supported."}
                                </p>
                                <p className="text-sm text-red-600 mt-2">
                                    Please try uploading a clearer image or a different file format.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : aiInsights ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-slate-900">AI Report Analysis</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Summary */}
                            <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {aiInsights.summary}
                            </div>

                            {/* Concerns */}
                            {aiInsights.concerns && aiInsights.concerns.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-slate-900 mb-2">Main Concerns</h3>
                                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                                        {aiInsights.concerns.map((concern, idx) => (
                                            <li key={idx}>{concern}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-slate-900 mb-2">What to Do Next</h3>
                                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                                        {aiInsights.recommendations.map((rec, idx) => (
                                            <li key={idx}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Urgency Badge */}
                            {aiInsights.urgency && (
                                <div className="pt-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${aiInsights.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                        aiInsights.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {aiInsights.urgency === 'high' ? '⚠️ High Priority' :
                                            aiInsights.urgency === 'medium' ? '⚡ Medium Priority' :
                                                '✓ Low Priority'}
                                    </span>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <div className="pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                    {aiInsights.disclaimer || "This is not medical advice. Please consult a healthcare professional."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : report.status === "done" ? (
                    <div className="bg-amber-50 rounded-lg shadow-sm p-6 mb-6 border border-amber-200">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                            <div>
                                <h2 className="text-lg font-semibold text-amber-900">Limited Analysis Available</h2>
                                <p className="text-sm text-amber-700 mt-1">
                                    The report was processed, but AI analysis is not available. This might be because:
                                </p>
                                <ul className="text-sm text-amber-700 mt-2 list-disc list-inside space-y-1">
                                    <li>No recognizable test values were found in the image</li>
                                    <li>The image quality was too low to extract text accurately</li>
                                    <li>The AI service was temporarily unavailable</li>
                                </ul>
                                <p className="text-sm text-amber-600 mt-3">
                                    You can still view any extracted data below, or try uploading a clearer image.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Abnormalities */}
                {abnormalities.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Detected Abnormalities</h2>
                        <div className="space-y-3">
                            {abnormalities.map((flag, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start p-4 rounded-lg ${flag.status === "high"
                                        ? "bg-red-50 border border-red-200"
                                        : "bg-amber-50 border border-amber-200"
                                        }`}
                                >
                                    <AlertTriangle
                                        className={`h-5 w-5 mr-3 flex-shrink-0 ${flag.status === "high" ? "text-red-600" : "text-amber-600"
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 capitalize">{flag.test}</p>
                                        <p className="text-sm text-slate-700 mt-1">
                                            Value: {flag.value} {flag.unit} (Normal: {flag.normalRange})
                                        </p>
                                        <p className="text-sm text-slate-600 mt-1">{flag.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Parsed Data */}
                {report.parsedData && report.parsedData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Lab Results</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-medium text-slate-900">Test</th>
                                        <th className="text-left py-3 px-4 font-medium text-slate-900">Value</th>
                                        <th className="text-left py-3 px-4 font-medium text-slate-900">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.parsedData.map((test, idx) => (
                                        <tr key={idx} className="border-b border-slate-100">
                                            <td className="py-3 px-4 capitalize text-slate-900">{test.test}</td>
                                            <td className="py-3 px-4 text-slate-700">{test.value}</td>
                                            <td className="py-3 px-4 text-slate-600">{test.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportDetail;
