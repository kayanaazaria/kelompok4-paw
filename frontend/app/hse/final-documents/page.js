"use client";

import { getFinalDocuments, downloadFinalDocument, viewFinalDocument, getAllHSEDocuments } from '@/services/documentService'; 
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CircleCheck, FileText, Clock, XCircle, Search, ChevronDown, Eye, Plus, Shield, LineChart, LogOut, FileDown, Eye as EyeIcon } from 'lucide-react';
import Image from 'next/image';
import { Poppins } from 'next/font/google'; 
import { getDecodedToken, getRoleRoute, getRoleStatus } from '@/utils/auth';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'], 
    display: 'swap',
});

const STATUS_MAP = {
    'Draft': { label: 'Draft', icon: FileText, color: 'bg-gray-50 text-gray-700' },
    'Menunggu Persetujuan Kepala Bidang': { label: 'Menunggu Persetujuan', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    'Menunggu Persetujuan Direktur SDM': { label: 'Menunggu Persetujuan', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    'Disetujui': { label: 'Disetujui', icon: CircleCheck, color: 'bg-emerald-100 text-emerald-800' },
    'Ditolak Kepala Bidang': { label: 'Ditolak', icon: XCircle, color: 'bg-red-100 text-red-800' },
    'Ditolak Direktur SDM': { label: 'Ditolak', icon: XCircle, color: 'bg-red-100 text-red-800' },
};

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
                            {user?.username?.[0]?.toUpperCase() || 'RI'}
                        </span>
                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-sm font-semibold text-gray-900">{user?.username || 'Rina Kusuma'}</span>
                            <span className="text-xs text-gray-500">{user?.email || 'hse@solanum.com'}</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                            <div className="border-b pb-3 mb-3">
                                <p className="font-semibold text-gray-900">{user?.username || 'Rina Kusuma'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'hse@solanum.com'}</p>
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

const CardStatus = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between h-full transform transition duration-300 hover:shadow-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <h2 className="text-4xl font-extrabold text-gray-800">{count}</h2>
            </div>
            <div className={`p-3 rounded-full ${color} flex items-center justify-center`}>
                <Icon size={20} className="opacity-90" />
            </div>
        </div>
    </div>
);

const useHSEDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua Status');

    useEffect(() => {
        const { status: roleStatus, role } = getRoleStatus(['hse']);
        if (roleStatus !== 'authorized') {
            const fallback = roleStatus === 'unauthorized' ? '/login' : getRoleRoute(role);
            router.replace(fallback);
            setLoading(false);
            return;
        }

        const decoded = getDecodedToken();
        if (decoded) {
            setUser(decoded);
        }

        async function fetchDocuments() {
            try {
                const data = await getAllHSEDocuments();
                setDocuments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Gagal mengambil dokumen:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, [router]);

    const filteredDocuments = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return documents.filter(doc => {
            const docStatusLabel = STATUS_MAP[doc.status]?.label || 'Lainnya';
            const statusMatch = filterStatus === 'Semua Status' || docStatusLabel === filterStatus;

            const searchMatch = doc.namaPekerja.toLowerCase().includes(lowerSearchTerm) ||
                              doc.department.toLowerCase().includes(lowerSearchTerm) ||
                              doc.requestNumber?.toLowerCase().includes(lowerSearchTerm); 

            return statusMatch && searchMatch;
        });
    }, [documents, searchTerm, filterStatus]);

    const statusCounts = useMemo(() => {
        const counts = { Draft: 0, 'Menunggu Persetujuan': 0, Disetujui: 0, Ditolak: 0 };
        documents.forEach(doc => {
            const statusLabel = STATUS_MAP[doc.status]?.label;
            if (statusLabel) {
                counts[statusLabel] += 1;
            }
        });
        return counts;
    }, [documents]);

    return { loading, user, documents: filteredDocuments, statusCounts, searchTerm, setSearchTerm, filterStatus, setFilterStatus };
};

export default function HSEDashboardPage() {
    const { loading, user, documents, statusCounts, searchTerm, setSearchTerm, filterStatus, setFilterStatus } = useHSEDashboard();
    const router = useRouter();
    
    const documentsWithRequestNumber = documents.map((doc, index) => {
        const year = new Date(doc.createdAt).getFullYear();
        const requestNum = `INC-${year}-${String(index + 1).padStart(4, '0')}`;
        return {
            ...doc,
            requestNumber: doc.requestNumber || requestNum,
            statusLabel: STATUS_MAP[doc.status]?.label || 'Draft'
        };
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
    };

    if (loading) {
        return <div className="p-10 text-center">Memuat Dashboard HSE...</div>;
    }

    if (!user) {
        return <div className="p-10 text-center">Akses Ditolak. Redirecting...</div>;
    }

    return (
        <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
            <Header user={user} onLogout={handleLogout} />

                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Judul & Tombol */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6 md:p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="p-3 bg-white/10 rounded-full flex-shrink-0">
                                <Shield size={40} /> 
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-extrabold">Dashboard HSE</h1>
                                <p className="text-sm font-light opacity-80 mt-1">Health, Safety & Environment Management</p>
                                <p className="mt-2 text-base">Kelola dan pantau semua laporan insiden keselamatan kerja di SOLANUM AGROTECH</p>
                            </div>
                            <button className="flex items-center px-4 py-2 bg-white text-emerald-600 font-semibold rounded-lg shadow hover:shadow-md transition duration-200 flex-shrink-0 h-fit">
                                <Plus size={20} className="mr-1" /> Buat Laporan Baru
                            </button>
                        </div>
                    </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <CardStatus title="Draft" count={statusCounts.Draft} icon={FileText} color="bg-gray-100 text-gray-800" />
                    <CardStatus title="Menunggu Persetujuan" count={statusCounts['Menunggu Persetujuan']} icon={Clock} color="bg-yellow-100 text-yellow-800" />
                    <CardStatus title="Disetujui" count={statusCounts.Disetujui} icon={CircleCheck} color="bg-emerald-100 text-emerald-800" />
                    <CardStatus title="Ditolak" count={statusCounts.Ditolak} icon={XCircle} color="bg-red-100 text-red-800" />
                </div>

                {/* Daftar Laporan */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <LineChart size={24} className="text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Daftar Laporan</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{documents.length} laporan ditemukan</p>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 items-center">
                        <div className="relative flex-grow w-full sm:w-auto">
                            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nomor request, nama karyawan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-150"
                            />
                        </div>
                        
                        <div className="relative w-full sm:w-56">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none w-full pr-10 pl-4 py-3 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition duration-150 cursor-pointer"
                            >
                                <option value="Semua Status">Semua Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Laporan Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Request</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Karyawan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {documentsWithRequestNumber.map((doc) => {
                                    const statusData = STATUS_MAP[doc.status] || { label: 'Draft', color: 'bg-gray-200 text-gray-800' };
                                    
                                    const timeAgo = (dateString) => {
                                        const now = new Date();
                                        const past = new Date(dateString);
                                        const diff = Math.floor((now - past) / (1000 * 60 * 60 * 24));
                                        return diff <= 0 ? 'Hari ini' : `${diff} hari yang lalu`;
                                    };

                                    return (
                                        <tr key={doc._id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.requestNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.namaPekerja}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusData.color}` }>
                                                    {statusData.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timeAgo(doc.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => router.push(`/dashboard/approval-flow/${doc._id}`)}
                                                        className="text-gray-500 hover:text-emerald-600 transition duration-150 p-1 rounded hover:bg-gray-100"
                                                        title="Lihat Detail"
                                                    >
                                                        <EyeIcon size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}