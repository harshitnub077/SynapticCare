import React, { useState } from 'react';
import api from '../api/axiosConfig';

const TestUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [reportId, setReportId] = useState(null);
    const [reportData, setReportData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus('Please select a file');
            return;
        }

        try {
            setStatus('Uploading...');
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setReportId(response.data.report.id);
            setStatus(`Uploaded! Report ID: ${response.data.report.id}. Status: ${response.data.report.status}`);
        } catch (error) {
            setStatus(`Error: ${error.response?.data?.message || error.message}`);
            console.error(error);
        }
    };

    const checkStatus = async () => {
        if (!reportId) return;

        try {
            const response = await api.get(`/reports/${reportId}`);
            setReportData(response.data.report);
            setStatus(`Status: ${response.data.report.status}`);
        } catch (error) {
            setStatus(`Error checking status: ${error.response?.data?.message || error.message}`);
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Test Report Upload & Analysis</h1>

            <div style={{ marginBottom: '20px' }}>
                <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>
            </div>

            {reportId && (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={checkStatus}>Check Status</button>
                </div>
            )}

            {status && (
                <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
                    <strong>Status:</strong> {status}
                </div>
            )}

            {reportData && (
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h2>Report Data</h2>
                    <p><strong>Status:</strong> {reportData.status}</p>
                    <p><strong>Filename:</strong> {reportData.filename}</p>
                    <p><strong>Extracted Text Length:</strong> {reportData.extractedText?.length || 0} chars</p>
                    <p><strong>Parsed Data Items:</strong> {reportData.parsedData?.length || 0}</p>
                    <p><strong>Abnormalities:</strong> {reportData.flags?.abnormalities?.length || 0}</p>
                    <p><strong>Has AI Insights:</strong> {reportData.flags?.aiInsights ? 'YES ✓' : 'NO ✗'}</p>

                    {reportData.flags?.aiInsights && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                            <h3>AI Analysis</h3>
                            <p><strong>Summary:</strong> {reportData.flags.aiInsights.summary}</p>
                            <p><strong>Urgency:</strong> {reportData.flags.aiInsights.urgency}</p>
                            <div>
                                <strong>Concerns:</strong>
                                <ul>
                                    {reportData.flags.aiInsights.concerns?.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Recommendations:</strong>
                                <ul>
                                    {reportData.flags.aiInsights.recommendations?.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <details style={{ marginTop: '20px' }}>
                        <summary>Full JSON Data</summary>
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                            {JSON.stringify(reportData, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default TestUpload;
