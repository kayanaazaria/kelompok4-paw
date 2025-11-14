"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { downloadFinalDocument } from '@/services/documentService'; 
import api from '@/services/documentService'; 

function checkUserRole() {
    if (typeof window === 'undefined') return { status: 'loading' }; 

    const token = localStorage.getItem('jwt_token');
    if (!token) return { status: 'unauthorized' }; 

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        
        if (role === 'kepala_bidang' || role === 'direktur_sdm') {
            return { status: 'authorized', role };
        } else {
            return { status: 'forbidden', role };
        }
    } catch (e) {
        return { status: 'unauthorized' };
    }
}

export default function ApprovalFlowPage({ params }) {
    const router = useRouter();
    const pathname = usePathname();
    const { status: roleStatus, role: userRole } = checkUserRole();
    const pathSegments = pathname.split('/');
    const currentDocumentId = pathSegments[pathSegments.length - 1];       
    const [stableDocumentId, setStableDocumentId] = useState(currentDocumentId);
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {       
        if (roleStatus === 'authorized' && currentDocumentId && currentDocumentId !== '[id]') {
            
            async function fetchDetail() {
                try {
                    const response = await api.get(`/laporan/${currentDocumentId}`);
                    setDocumentData(response.data);
                } catch (err) {
                    console.error("Gagal fetching detail dokumen:", err);
                    setError("Gagal memuat detail. Pastikan ID dokumen valid dan statusnya sudah diajukan.");
                } finally {
                    setLoading(false);
                }
            }
            fetchDetail();

        } else if (roleStatus !== 'loading') {
            setLoading(false);
            if (roleStatus === 'unauthorized' || roleStatus === 'forbidden') {
                router.push('/'); 
            }
        }
    }, [roleStatus, router, currentDocumentId]); 

    if (roleStatus === 'loading' || loading) {
        return <div className="p-4">Memeriksa otorisasi dan memuat data dokumen...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }
    
    if (roleStatus === 'unauthorized' || roleStatus === 'forbidden') {
        return <div className="p-4 text-red-500">Akses Ditolak. Role Anda ({userRole}) tidak diizinkan mengakses halaman ini.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Alur Persetujuan & Verifikasi Dokumen</h1>
            {}
            <h2>ID Dokumen: {currentDocumentId || "Memuat..."}</h2> 
            <p className="mb-4">Anda login sebagai: <strong>{userRole}</strong></p>
            
            {documentData && (
                <div className="bg-gray-50 p-4 border rounded">
                    <h2 className="text-xl mb-3">Laporan: {documentData.namaPekerja} - {documentData.department}</h2>
                    
                    {}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold border-b pb-1">Riwayat Persetujuan</h3>
                        <p>Status Dokumen: <strong>{documentData.status}</strong></p>
                        
                        {}
                        <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50">
                            <strong>Kepala Bidang:</strong> 
                            {documentData.signedByKabid 
                                ? <span className="text-green-600"> Disetujui</span> 
                                : <span className="text-yellow-600"> Menunggu Persetujuan</span>
                            }
                        </div>
                        
                        {}
                        <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50">
                            <strong>Direktur SDM:</strong> 
                            {documentData.approvedByDirektur
                                ? <span className="text-green-600"> Disetujui</span> 
                                : <span className="text-yellow-600"> Menunggu Persetujuan</span>
                            }
                        </div>
                    </div>

                    {}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold border-b pb-1">QR Code Verifikasi</h3>
                        <p>Link File: {documentData.attachmentUrl}</p>
                        <p className="text-sm mt-2">Link untuk QR Code: <a href={`/verify/${stableDocumentId}`} target="_blank" className="text-blue-500">http://localhost:3000/verify/{stableDocumentId}</a></p>
                    </div>

                    {}
                    <div className="mt-6">
                        <button 
                            onClick={() => downloadFinalDocument(currentDocumentId)} 
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Download PDF Final
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}