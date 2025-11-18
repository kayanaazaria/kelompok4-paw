"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/services/api';
import { CheckCircle, User, Briefcase, Clock } from 'lucide-react';
import { ApprovalTimelineCompact } from '@/components/shared/ApprovalTimeline';

export default function VerificationPage({ params }) {
    const pathname = usePathname(); 
    const pathSegments = pathname.split('/');
    const documentId = pathSegments[pathSegments.length - 1]; 
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (documentId && documentId !== '[id]') {
            
            async function fetchVerificationDetail() {
                try {
                    const response = await api.get(`api/laporan/${documentId}`);
                    setDocumentData(response.data);
                    
                    if (response.data.status !== 'Disetujui' && response.data.status !== 'Selesai' && response.data.status !== 'Disetujui Direktur SDM') {
                        setError("Dokumen ini belum diverifikasi final atau telah ditolak.");
                    }
                } catch (err) {
                    console.error("Verification failed:", err.response ? err.response.status : err.message);
                    setError("ID dokumen tidak ditemukan atau terjadi kesalahan server.");
                } finally {
                    setLoading(false);
                }
            }
            fetchVerificationDetail();
        } else {
             setLoading(false);
             setError("ID verifikasi tidak valid.");
        }
    }, [documentId]); 

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memverifikasi keaslian dokumen...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header Success */}
                <div className="bg-green-600 rounded-t-lg p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Dokumen Terverifikasi</h1>
                    <p className="text-green-100">
                        Dokumen ini adalah dokumen resmi SOLANUM AGROTECH yang telah terverifikasi!
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-b-lg shadow-lg p-6">
                    {/* ID Verifikasi */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-600 mb-1">ID Verifikasi Dokumen</p>
                        <p className="text-xl font-bold text-blue-600">{documentId}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-700">Status: Selesai</span>
                        </div>
                    </div>

                    {/* Detail Laporan */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Detail Laporan
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Nama Pekerja</p>
                                    <p className="font-semibold text-gray-900">{documentData.namaPekerja}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Departemen</p>
                                    <p className="font-semibold text-gray-900">{documentData.department}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alur Persetujuan */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Alur Persetujuan</h3>
                        <ApprovalTimelineCompact steps={[
                            {
                                id: 1,
                                label: 'Laporan Terkirim',
                                detail: `Disetujui oleh HSE • ${documentData.createdByHSE?.username || 'HSE'} • ${new Date(documentData.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}`,
                                status: 'done'
                            },
                            {
                                id: 2,
                                label: 'Persetujuan Kepala Bidang',
                                detail: `Disetujui oleh ${documentData.signedByKabid?.username || 'kabid_software1'} • ${documentData.kabidSignedDate ? new Date(documentData.kabidSignedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '30/9/2025'}`,
                                status: 'done'
                            },
                            {
                                id: 3,
                                label: 'Persetujuan Direktur SDM',
                                detail: `Disetujui oleh ${documentData.approvedByDirektur?.username || 'DirekturSDM1'} • ${documentData.direkturApprovedDate ? new Date(documentData.direkturApprovedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '30/9/2025'}`,
                                status: 'done'
                            },
                            {
                                id: 4,
                                label: 'Selesai',
                                detail: 'Proses persetujuan telah selesai',
                                status: 'done'
                            }
                        ]} />
                    </div>

                    {/* Footer Info */}
                    <div className="border-t pt-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-5">
                            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>Diverifikasi pada: <strong>{documentData.direkturApprovedDate ? new Date(documentData.direkturApprovedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date(documentData.kabidSignedDate || documentData.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="font-semibold">Keamanan Dokumen</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed text-justify mb-2">
                            Dokumen ini telah melalui proses verifikasi digital dan tercatat dalam sistem SOLANUM AGROTECH. 
                            Setiap dokumen memiliki kode QR unik yang tidak dapat diduplikasi. 
                            Jika Anda menemukan ketidaksesuaian, harap hubungi departemen HSE.
                        </p>
                    </div>

                    {/* Footer Brand */}
                    <div className="text-center mt-6 pt-4 border-t">
                        <p className="text-xs text-gray-500">SOLANUM AGROTECH - Incident Report Management System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}