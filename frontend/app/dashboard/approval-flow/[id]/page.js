"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { downloadFinalDocument } from '@/services/documentService'; 
import api, {API_BASE_URL} from '@/services/api'; 
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Eye, Download, ChevronDown, LogOut, FileEdit } from 'lucide-react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { getDecodedToken, getRoleRoute, getRoleStatus } from '@/utils/auth';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '600', '700'], 
    variable: '--font-poppins', 
});

const Header = ({ user, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex justify-between items-center bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="flex items-center py-2 px-4 h-20">
                <div className="relative h-full w-48">
                    <Image 
                        src="/logo_dashboard.png" 
                        alt="SOLANUM AGROTECH" 
                        fill 
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4 px-4">
                <span className="text-sm text-gray-600">Role: HSE</span>
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition duration-200 cursor-pointer"
                    >
                        <span className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</span>
                            <span className="text-xs text-gray-500">{user?.email || 'user@solanum.com'}</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                            <div className="border-b pb-3 mb-3">
                                <p className="font-semibold text-gray-900">{user?.username || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'user@solanum.com'}</p>
                                <p className="text-xs text-gray-600 mt-1">HSE</p>
                            </div>
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full p-2 rounded text-sm font-medium transition"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ALLOWED_ROLES = ['kepala_bidang', 'direktur_sdm', 'hse'];

function checkUserRole() {
    if (typeof window === 'undefined') return { status: 'loading' };
    return getRoleStatus(ALLOWED_ROLES);
}

export default function ApprovalFlowPage({ params }) {
    const router = useRouter();
    const pathname = usePathname();
    const { status: roleStatus, role: userRole } = checkUserRole();
    const pathSegments = pathname.split('/');
    const currentDocumentId = pathSegments[pathSegments.length - 1];       
    const [stableDocumentId, setStableDocumentId] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const decoded = getDecodedToken();
        if (decoded) {
            setUserData(decoded);
        }
    }, []);

    useEffect(() => {       
        if (roleStatus === 'authorized' && currentDocumentId && currentDocumentId !== '[id]') {
            
            setStableDocumentId(currentDocumentId);

            async function fetchDetail() {
                try {
                    const response = await api.get(`/api/laporan/${currentDocumentId}`);
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
                const fallback = roleStatus === 'unauthorized' ? '/login' : getRoleRoute(userRole);
                router.replace(fallback);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
    };

    const handleEditDraft = () => {
        alert(`Mengaktifkan mode edit untuk Laporan Draft ID: ${stableDocumentId}`);
    };

    const getStatusBadge = (status) => {
        if (status === 'Disetujui') {
            return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Disetujui</span>;
        } else if (status === 'Draft') {
            return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">Draft</span>;
        } else if (status.includes('Menunggu')) {
            return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Menunggu</span>;
        } else if (status.includes('Ditolak')) {
            return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Ditolak</span>;
        }
    };

    const getTimelineColor = (state) => {
        switch(state) {
            case 'done':
                return 'bg-green-500';
            case 'current':
                return 'bg-yellow-500';
            case 'rejected':
                return 'bg-red-500';
            case 'created_draft': 
            case 'pending_draft':
            case 'pending': 
            default:
                return 'bg-gray-400'; 
        }
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
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /> {/* Lingkaran jam */}
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    };

    const getStepState = (step) => {
        const s = documentData?.status;

        if (s === 'Draft') {
            if (step === 1) return 'created_draft'; 
            if (step === 2 || step === 3) return 'pending_draft'; 
            return 'skipped';
        }
        
        if (step === 1) return 'done';

        if (step === 2) {
            if (s === 'Ditolak Kepala Bidang') return 'rejected';
            if (s === 'Menunggu Persetujuan Kepala Bidang') return 'current';
            return 'done';
        }

        if (step === 3) {
            if (s === 'Disetujui') return 'done';
            if (s === 'Menunggu Persetujuan Direktur SDM') return 'current';
            if (s === 'Ditolak Direktur SDM') return 'rejected';
            if (s === 'Ditolak Kepala Bidang') return 'skipped';
            return 'pending';
        }
    
        if (step === 4) { 
            if (s === 'Disetujui') return 'done';
            return 'skipped';
        }

        return 'pending';
    };

    const approvalSteps = [
        { 
            id: 1, 
            label: documentData?.status === 'Draft' ? 'Laporan Dibuat' : 'Laporan Terkirim', 
            detail: 'HSE • 4 hari yang lalu', 
            person: 'HSE' 
        },
        { id: 2, label: 'Persetujuan Kepala Bidang', detail: 'Budi Santoso • 4 hari yang lalu', person: 'Budi Santoso' },
        { id: 3, label: 'Persetujuan Direktur SDM', detail: 'Hendra Widjaja • 4 hari yang lalu', person: 'Hendra Widjaja' },
        { id: 4, label: 'Selesai', detail: 'Proses persetujuan telah selesai', person: '' } 
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={userData} onLogout={handleLogout} />

            <div className={`container mx-auto px-4 py-8 max-w-4xl ${poppins.className}`}>
                {documentData && (
                    <>
                        {/* Tombol Kembali */}
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
                        >
                            <ArrowLeft size={20} /> Kembali
                        </button>

                        {/* Laporan Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Laporan Insiden <span className="text-blue-600 text-lg">{documentData._id}</span>
                                    </h1>
                                    <p className="text-gray-500 mt-1">Dibuat 4 hari yang lalu</p>
                                </div>
                                <div className="flex gap-2">
                                    {getStatusBadge(documentData.status)}
                                    {documentData.status === 'Menunggu Persetujuan Direktur SDM' && (
                                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Menunggu</span>
                                    )}
                                </div>
                            </div>

                            {/* Detail Karyawan */}
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">👤</span>
                                        <span className="text-gray-600">Nama Karyawan</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{documentData.namaPekerja}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">📅</span>
                                        <span className="text-gray-600">Tanggal Insiden</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{new Date(documentData.tanggalKejadian).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">🆔</span>
                                        <span className="text-gray-600">NIP</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{documentData.nomorIndukPekerja}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">⚠️</span>
                                        <span className="text-gray-600">Skala Cedera</span>
                                    </div>
                                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold text-sm">{documentData.skalaCedera}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">🏢</span>
                                        <span className="text-gray-600">Departemen</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{documentData.department}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600">📋</span>
                                        <span className="text-gray-600">Pelapor</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">HSE</p>
                                    <p className="text-sm text-gray-500">hse@solanumagrotect.com</p>
                                </div>
                            </div>

                            {/* Detail Insiden */}
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Detail Insiden</h3>
                                <p className="text-gray-700">{documentData.detailKejadian}</p>
                            </div>
                        </div>

                        {/* Alur Persetujuan - Timeline Vertical */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Alur Persetujuan</h3>

                            <div>
                                {approvalSteps.map((step, index) => {
                                    const stepState = getStepState(step.id);

                                    if (stepState === 'skipped') return null; 
                                    
                                    const colorClass = getTimelineColor(stepState);
                                    const innerIcon = getInnerIcon(stepState);
                                    
                                    const isLastDisplayedStep = (() => {
                                        const visibleSteps = approvalSteps.filter(s => getStepState(s.id) !== 'skipped');
                                        const lastVisibleStep = visibleSteps[visibleSteps.length - 1];
                                        return lastVisibleStep && lastVisibleStep.id === step.id;
                                    })();

                                    let connectorColor = 'bg-gray-400';
                                    if (stepState === 'done') {
                                        connectorColor = 'bg-green-600'; 
                                    } else if (getStepState(step.id + 1) === 'done' || getStepState(step.id + 1) === 'current') {
                                        connectorColor = getTimelineColor(getStepState(step.id + 1)); 
                                    } else if (getStepState(step.id + 1).includes('draft')) {
                                        connectorColor = 'bg-gray-400'; 
                                    }
                                    
                                    const stepDetailText = (documentData.status === 'Draft' && step.id > 1)
                                        ? 'Menunggu pengajuan' 
                                        : (stepState.includes('pending') || stepState === 'current') && step.id > 1 
                                        ? `${step.person} • Menunggu` 
                                        : step.detail;

                                    const finalLabel = step.id === 4 ? step.label : step.label;
                                    const finalDetail = step.id === 4 && stepState === 'done' ? step.detail : stepDetailText;


                                    return (
                                        <div key={step.id} className="flex items-start gap-4">
                                            <div className="w-16 flex flex-col items-center">
                                                {/* circle */}
                                                <div className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center z-10 transition duration-300`}>
                                                    {innerIcon}
                                                </div>
                                                {/* connector */}
                                                {!isLastDisplayedStep && (
                                                    <div className={`${connectorColor} w-0.5 h-8 transition duration-300`}></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{finalLabel}</p>
                                                <p className="text-sm text-gray-500 mb-4">{finalDetail}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dokumen Final */}
                        {documentData.status === 'Draft' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Laporan Draft</h3>
                                <button 
                                    onClick={handleEditDraft}
                                    className="w-full border-2 border-gray-500 text-gray-600 p-4 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                                >
                                    <FileEdit size={20} /> Edit Draft Laporan
                                </button>
                            </div>
                        )}

                        {documentData.status === 'Disetujui' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Final</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            window.open(`${API_BASE_URL}/finaldoc/laporan/${stableDocumentId}`, '_blank');
                                        }} 
                                        className="w-full border-2 border-blue-500 text-blue-600 p-4 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Eye size={20} /> Lihat Dokumen Final
                                    </button>
                                    <button 
                                        onClick={() => downloadFinalDocument(stableDocumentId)} 
                                        className="w-full border-2 border-green-500 text-green-600 p-4 rounded-lg hover:bg-green-50 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} /> Download Dokumen Final
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Riwayat Persetujuan */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Persetujuan</h3>
                            <div className="space-y-4">
                                {/* Laporan dibuat */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-1">📋</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">Laporan dibuat</p>
                                            <p className="text-sm text-gray-500">Rina Kusuma</p>
                                            <p className="text-sm text-gray-500">hse@solanumagrotect.com</p>
                                            <p className="text-sm text-gray-500">4 hari yang lalu</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ditolak oleh Kepala Bagian */}
                                {documentData.status === 'Ditolak Kepala Bidang' && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-900">Ditolak oleh Kepala Bagian</p>
                                                <p className="text-sm text-gray-500">Budi Santoso</p>
                                                <p className="text-sm text-gray-500">kepala.mechanical@solanumagrotect.com</p>
                                                <p className="text-sm text-gray-500">4 hari yang lalu</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Disetujui oleh Kepala Bagian */}
                                {(documentData.status === 'Menunggu Persetujuan Direktur SDM' || documentData.status === 'Disetujui' || documentData.status === 'Ditolak Direktur SDM') && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-900">Disetujui oleh Kepala Bagian</p>
                                                <p className="text-sm text-gray-500">Budi Santoso</p>
                                                <p className="text-sm text-gray-500">kepala.mechanical@solanumagrotect.com</p>
                                                <p className="text-sm text-gray-500">4 hari yang lalu</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Ditolak oleh Direktur SDM */}
                                {documentData.status === 'Ditolak Direktur SDM' && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-900">Ditolak oleh Direktur SDM</p>
                                                <p className="text-sm text-gray-500">Hendra Widjaja</p>
                                                <p className="text-sm text-gray-500">direktur.sdm@solanumagrotect.com</p>
                                                <p className="text-sm text-gray-500">4 hari yang lalu</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Disetujui oleh Direktur SDM */}
                                {documentData.status === 'Disetujui' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-900">Disetujui oleh Direktur SDM</p>
                                                <p className="text-sm text-gray-500">Hendra Widjaja</p>
                                                <p className="text-sm text-gray-500">direktur.sdm@solanumagrotect.com</p>
                                                <p className="text-sm text-gray-500">4 hari yang lalu</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}