"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/services/documentService'; 

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
                    const response = await api.get(`/laporan/${documentId}`);
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
        return <div className="p-4">Memverifikasi keaslian dokumen...</div>;
    }
    
    if (error) {
        return <div className="p-4" style={{ color: 'red' }}>Verifikasi Gagal: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">✅ Verifikasi Dokumen Berhasil</h1>
            <p>ID Verifikasi: <strong>{documentId}</strong></p>
            <p>Status Final: <strong style={{ color: documentData.status === 'Disetujui' ? 'green' : 'blue' }}>{documentData.status}</strong></p>
            
            <div className="mt-4">
                <h3>Detail Laporan</h3>
                <p>Pegawai: {documentData.namaPekerja}</p>
                <p>Departemen: {documentData.department}</p>
                
                {}
                <h3 className="text-lg font-semibold mt-3">Alur Persetujuan</h3>
                <p>HSE: <strong style={{ color: 'green' }}>APPROVED</strong></p>
                <p>Kepala Bidang: {documentData.signedByKabid ? 'APPROVED' : 'PENDING'}</p>
                <p>Direktur SDM: {documentData.approvedByDirektur ? 'APPROVED' : 'PENDING'}</p>
            </div>
        </div>
    );
}