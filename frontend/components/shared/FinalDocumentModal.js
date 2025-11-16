"use client";

import { useState, useRef, useEffect } from 'react';
import { XCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QRCodeLib from 'qrcode';
import Image from 'next/image';

const CanvasQRCode = ({ url, id }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeLib.toCanvas(canvasRef.current, url, {
                errorCorrectionLevel: 'H', 
                width: 128, 
                margin: 1, 
            }, function (error) {
                if (error) console.error('Gagal membuat QR Code:', error);
            });
        }
    }, [url]);

    return <canvas ref={canvasRef} id={id} />;
};

const getInnerIcon = (state) => {
    if (state === 'done') {
        return (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (state === 'rejected') {
        return (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (state === 'current' || state.includes('pending') || state.includes('draft')) {
        return (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }
    return (
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};

const FinalDocumentModal = ({ isOpen, onClose, documentData, approvalSteps, getStepState }) => {
    if (!isOpen) return null;

    const router = useRouter();
    const documentId = documentData._id || 'ID_NOT_FOUND';
    const verificationUrl = `${window.location.origin}/verify/${documentId}`;

    const getTimelineColor = (state) => {
        switch(state) {
            case 'done': return 'bg-green-600';
            case 'current': return 'bg-yellow-400';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const handleVerifyClick = () => {
        if (documentId && documentId !== 'ID_NOT_FOUND') {
            router.push(`/verify/${documentId}`);
            onClose(); 
        } else {
            alert("ID Dokumen tidak ditemukan untuk verifikasi.");
        }
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-20 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="relative flex justify-center items-center border-b p-4 sticky top-0 bg-white z-20">
                    
                    <h2 className="text-xl font-semibold text-gray-800">Dokumen Final Laporan Insiden</h2>
                    
                    <button 
                        onClick={onClose} 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Body Konten Modal */}
                <div className="p-6">
                    <p className="text-center text-sm text-gray-600 mb-6">Dokumen ini merupakan versi final dari laporan insiden kerja yang telah disetujui.</p>

                    {/* Bagian Detail Dokumen Final */}
                    <div>
                        <div className="text-center mb-6">
                            <div className="relative mx-auto mb-4" style={{ width: '120px', height: '120px' }}>
                                <Image 
                                    src="/logo_solanum_vertical.png" 
                                    alt="SOLANUM AGROTECH Logo" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">LAPORAN INSIDEN KERJA</p>
                        </div>

                        {/* Tabel Detail Informasi */}
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-6">
                            <table className="w-full text-left text-gray-700">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 font-normal w-1/4 text-gray-600">Tanggal Insiden</td>
                                        <td className="py-3 px-4 font-semibold">
                                            {new Date(documentData.tanggalKejadian).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 font-normal text-gray-600">Departemen</td>
                                        <td className="py-3 px-4 font-semibold">{documentData.department}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 font-normal text-gray-600">Nama Pekerja</td>
                                        <td className="py-3 px-4 font-semibold">
                                            {documentData.namaPekerja}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 font-normal text-gray-600">Skala Insiden</td>
                                        <td className="py-3 px-4 font-semibold">
                                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                                                {documentData.skalaCedera}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-normal text-gray-600">NIP</td>
                                        <td className="py-3 px-4 font-semibold">{documentData.nomorIndukPekerja}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Deskripsi Insiden */}
                        <h4 className="font-bold text-gray-900 mb-2">Deskripsi Insiden</h4>
                        <p className="text-gray-700 whitespace-pre-wrap border p-4 rounded-lg bg-gray-50 mb-8">
                            {documentData.detailKejadian}
                        </p>
                    </div>
                    
                    {/* Bagian Alur Persetujuan dan QR */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Alur Persetujuan</h4>
                        {/* Replikasi Timeline dari halaman utama ke Modal */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm">
                            {approvalSteps.map((step) => {
                                const stepState = getStepState(step.id);
                                if (stepState === 'skipped') return null; 

                                const colorClass = getTimelineColor(stepState);
                                const icon = getInnerIcon(stepState); 
                                
                                const detailText = step.id === 4 && stepState === 'done' 
                                    ? 'Proses persetujuan telah selesai'
                                    : stepState === 'done'
                                    ? `Disetujui oleh ${step.person} • 4 hari lalu`
                                    : stepState === 'current'
                                    ? `Menunggu Persetujuan ${step.person}`
                                    : step.detail;

                                return (
                                    <div key={step.id} className={`flex items-start gap-4 p-3 mb-2 rounded-lg transition ${stepState === 'done' ? 'bg-green-50' : stepState === 'current' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                                        <div className="w-10 flex-shrink-0 flex flex-col items-center">
                                            <div className={`${colorClass} w-6 h-6 rounded-full flex items-center justify-center z-10`}>
                                                {icon}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-900">{step.label}</p>
                                            <p className="text-xs text-gray-600">
                                                {detailText}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* QR Code dan Verifikasi */}
                        <div className="text-center border-t border-gray-100 pt-6 mt-6 bg-white">
                            <p className="text-sm font-medium text-gray-700 mb-4">Scan QR Code untuk verifikasi dokumen</p>
                            
                            <div className="inline-block p-2 border border-gray-300 rounded-lg mb-4 bg-white shadow-sm">
                                {documentId !== 'ID_NOT_FOUND' ? (
                                    <CanvasQRCode url={verificationUrl} id="qr-code-canvas" />
                                ) : (
                                    <div style={{ width: 128, height: 128, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ID Error
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-4">(ID Dokumen: {documentId})</p>

                            {/* Tombol Verifikasi */}
                            <button 
                                onClick={handleVerifyClick} 
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto gap-2"
                            >
                                <Eye size={20} /> Lihat Verifikasi Dokumen
                            </button>
                            
                            <p className="text-xs text-gray-500 mt-4 text-gray-500">
                                Dokumen ini dihasilkan secara otomatis oleh sistem <br/> SOLANUM AGROTECH - Incident Report Management System
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalDocumentModal;