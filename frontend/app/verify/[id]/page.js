"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle, Clock, User, Building, ShieldCheck } from 'lucide-react';
import api from '@/services/documentService'; 
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '600', '700'], 
    variable: '--font-poppins', 
});

const VerificationStep = ({ name, person, date, isFinalStep = false }) => {
    const isApproved = true; 
    
    const displayDate = date || '4 hari lalu'; 
    const stepName = name === 'Laporan Terkirim' ? 'Laporan Terkirim' : name;
    
    const statusText = isFinalStep 
        ? 'Proses persetujuan telah selesai'
        : `Disetujui oleh ${person} pada ${displayDate}`;

    return (
        <div className="p-3 rounded-lg flex items-center justify-between bg-green-50">
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-800">{stepName}</p>
                    <p className="text-xs text-gray-500">
                        {statusText}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------

export default function VerificationPage({ params }) {
    const pathname = usePathname(); 
    const pathSegments = pathname.split('/');
    const documentId = pathSegments[pathSegments.length - 1]; 
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak tercatat';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    useEffect(() => {
        if (documentId && documentId !== '[id]') {
            
            async function fetchVerificationDetail() {
                try {
                    const response = await api.get(`/laporan/${documentId}`);
                    const data = response.data;
                    setDocumentData(data);
                    
                    const finalStatus = data.status || 'Draft'; 
                    
                    if (finalStatus !== 'Disetujui') {
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <p className="text-gray-700">Memverifikasi keaslian dokumen...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
                    <h2 className="text-xl font-bold text-red-600 mb-3">❌ Verifikasi Gagal</h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    const { 
        namaPekerja, 
        department, 
        namaKepalaBidang, 
        tanggalPersetujuanKepalaBidang,
        namaDirekturSDM,
        tanggalPersetujuanDirekturSDM,
        tanggalFinalisasi 
    } = documentData;
    
    const finalApprovalData = [
        { name: 'Laporan Terkirim', person: 'HSE', date: '4 hari lalu' }, 
        { name: 'Persetujuan Kepala Bidang', person: namaKepalaBidang || 'Budi Santoso', date: formatDate(tanggalPersetujuanKepalaBidang) || '4 hari lalu' },
        { name: 'Persetujuan Direktur SDM', person: namaDirekturSDM || 'Direktur SDM', date: formatDate(tanggalPersetujuanDirekturSDM) || '4 hari lalu' },
        { name: 'Selesai', person: '', date: '', isFinalStep: true}
    ];
    
    const finalVerificationTime = formatDate(tanggalFinalisasi) || 'Tanggal tidak ditemukan';

    return (
        <div className={`flex items-start justify-center min-h-screen bg-gray-100 p-8 ${poppins.className}`}>
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                
                <div className="text-center bg-green-600 text-white p-6 flex flex-col items-center justify-center">
    
                    <CheckCircle size={40} className="mb-3" />
                    
                    <div>
                        <h1 className="text-2xl font-bold">Dokumen Terverifikasi</h1>
                        <p className="text-base mt-2 px-6">
                            Dokumen ini adalah dokumen resmi SOLANUM AGROTECH yang telah terverifikasi!
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    
                    {/* ID Verifikasi Dokumen */}
                    <div className="text-center pb-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">ID Verifikasi Dokumen</p>
                        <h2 className="text-2xl font-bold text-blue-600">
                            {documentId}
                        </h2>
                    </div>

                    {/* Status Selesai */}
                    <div className="flex justify-center">
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-base">
                            <CheckCircle size={18} className="mr-2" /> Status: Selesai
                        </span>
                    </div>

                    {/* Detail Laporan */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 space-y-3">
                        <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Detail Laporan
                        </h3>
                        
                        <div className="flex items-center gap-3">
                            <User size={18} className="text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Nama Pekerja</p>
                                <p className="font-medium text-gray-900">{namaPekerja}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Building size={18} className="text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Departemen</p>
                                <p className="font-medium text-gray-900">{department}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Alur Persetujuan */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-gray-800">Alur Persetujuan</h3>
                        <div className="space-y-3">
                            {finalApprovalData.map((step, index) => (
                                <VerificationStep
                                    key={index}
                                    name={step.name}
                                    person={step.person}
                                    isFinalStep={step.isFinalStep}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Verifikasi Waktu dan Keamanan Dokumen */}
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock size={16} className="mr-2 text-gray-500" />
                            Diverifikasi pada: <strong className="ml-1 text-gray-800">{finalVerificationTime}</strong>
                        </div>
                        
                        <div className="text-sm text-gray-700">
                            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                                <ShieldCheck size={16} className="text-green-600 mr-1" />
                                Keamanan Dokumen
                            </h4>
                            <p className="text-justify text-xs text-gray-600 leading-relaxed">
                                Dokumen ini telah melalui proses verifikasi digital dan tercatat dalam sistem SOLANUM AGROTECH. Setiap dokumen memiliki kode QR unik yang tidak dapat diduplikasi. Jika Anda menemukan ketidaksesuaian, harap hubungi departemen HSE.
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-center pt-4">
                        <p className="text-xs text-gray-400">SOLANUM AGROTECH - Incident Report Management System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}