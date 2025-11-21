import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LogOut, Save, Send, Edit, Trash2, CheckCircle, XCircle, FileText, Upload, Loader2, XCircle as CancelIcon } from 'lucide-react';
import axios from 'axios';

// --- Global Constants (Based on Mongoose Schema) ---

const DEPARTMENTS = [
    'HSE',
    'Production',
    'HRD',
    'Finance',
    'Marketing',
    'Logistics'
];

const SKALA_CEDERA = ['Ringan', 'Menengah', 'Berat']; 

const STATUS_OPTIONS = [
    'Draft',
    'Menunggu Persetujuan Kepala Bidang',
    'Menunggu Persetujuan Direktur SDM',
    'Disetujui',
    'Ditolak Kepala Bidang',
    'Ditolak Direktur SDM'
];

// --- FAKE DATA & UTILITIES ---

const FAKE_HSE_USER_ID = 'user_hse_123';

const getDefaultReport = () => ({
    _id: null,
    tanggalKejadian: new Date().toISOString().substring(0, 10),
    namaPekerja: '',
    nomorIndukPekerja: '',
    detailKejadian: '',
    skalaCedera: SKALA_CEDERA[0],
    attachmentUrl: '', 
    department: DEPARTMENTS[0],
    status: 'Draft',
    isDraft: true,
    createdByHSE: FAKE_HSE_USER_ID,
    signedByKabid: null,
    approvedByDirektur: null,
});

const getFakeReport = () => ({
    _id: 'laporan_20250101',
    tanggalKejadian: '2025-10-20',
    namaPekerja: 'Budi Santoso',
    nomorIndukPekerja: 'PNK-4459',
    detailKejadian: 'Terpeleset di area gudang karena tumpahan oli yang belum dibersihkan. Pekerja mengalami cedera pergelangan kaki ringan.',
    skalaCedera: 'Ringan',
    attachmentUrl: 'foto_insiden_gudang.jpg', 
    department: 'Production',
    status: 'Menunggu Persetujuan Kepala Bidang',
    isDraft: false,
    createdByHSE: FAKE_HSE_USER_ID,
    signedByKabid: null,
    approvedByDirektur: null,
    investigasi: "Akar Masalah: Tumpahan oli (kondisi tidak aman). Penyebab mendasar: Kurangnya pelatihan kebersihan rutin.",
    tindakanKorektif: [
        { deskripsi: "Segera bersihkan tumpahan.", penanggungJawab: "Supervisor Produksi", batasWaktu: "2025-10-21", status: "Selesai" },
        { deskripsi: "Pasang tanda peringatan area basah.", penanggungJawab: "Staf HSE", batasWaktu: "2025-10-23", status: "Tertunda" }
    ]
});


// --- LAYANAN API (Didefinisikan di sini untuk self-contained code) ---

// Catatan: Port diubah menjadi 5001 sesuai setting di prompt sebelumnya.
const API_BASE_URL = 'http://localhost:5001/api/laporan'; 

const getAuthHeaders = () => {
    // Menggunakan token dummy yang valid (asumsi user adalah HSE)
    const token = localStorage.getItem('authToken') || 'FAKE_JWT_TOKEN_FOR_DEMO'; 
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const createFormData = (reportData, attachmentFile) => {
    const formData = new FormData();

    for (const key in reportData) {
        if (reportData[key] !== null && key !== '_id' && key !== 'tindakanKorektif' && key !== 'investigasi') {
            formData.append(key, reportData[key]);
        }
    }

    if (attachmentFile) {
        formData.append('attachment', attachmentFile);
    }

    return formData;
};

// Fungsi CRUD dasar 
const createLaporanDraft = async (reportData, attachmentFile) => {
    const formData = createFormData(reportData, attachmentFile);
    const response = await axios.post(API_BASE_URL, formData, getAuthHeaders());
    return response.data;
};

const updateLaporanData = async (laporanId, reportData, attachmentFile) => {
    const formData = createFormData(reportData, attachmentFile);
    const response = await axios.put(`${API_BASE_URL}/${laporanId}`, formData, getAuthHeaders());
    return response.data;
};

const submitLaporanAPI = async (laporanId) => {
    const response = await axios.put(`${API_BASE_URL}/${laporanId}/submit`, {}, getAuthHeaders());
    return response.data;
};

const getLaporanDetail = async (laporanId) => {
    const response = await axios.get(`${API_BASE_URL}/${laporanId}`, getAuthHeaders());
    return response.data;
};


// --- CORE COMPONENTS ---

const Header = ({ title }) => (
    <div className="bg-white p-4 sm:p-6 border-b border-blue-500/10 shadow-sm sticky top-0 z-10">
        <div className="w-full flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h1>
            <button
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 transition duration-150"
                onClick={() => console.log('Logout diklik')}
            >
                <LogOut size={18} />
                <span className="hidden sm:inline">Keluar</span>
            </button>
        </div>
    </div>
);

const Card = ({ title, children, className = '' }) => (
    <div className={`bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 ${className}`}>
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h2>}
        {children}
    </div>
);

const FormInput = ({ label, type = 'text', name, value, onChange, options, disabled = false, isRequired = true }) => {
    const baseClasses = "mt-1 block w-full p-3 border rounded-lg focus:ring-2 transition duration-150 shadow-sm";
    const activeClasses = "border-blue-300 focus:border-blue-500 focus:ring-blue-100";
    const disabledClasses = "bg-gray-50 text-gray-500 cursor-not-allowed";
    const labelStyle = `block text-sm font-medium text-gray-700 ${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`;

    let inputElement;

    if (type === 'select' && options) {
        inputElement = (
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
                disabled={disabled}
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    } else if (type === 'textarea') {
        inputElement = (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={4}
                className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
                disabled={disabled}
            />
        );
    } else {
        inputElement = (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
                disabled={disabled}
                placeholder={label}
            />
        );
    }

    return (
        <div className="mb-5">
            <label htmlFor={name} className={labelStyle}>
                {label}
            </label>
            {inputElement}
        </div>
    );
};


const FileUploadComponent = ({ label, fileName, handleAttachmentChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const hasFile = !!fileName;

    const handleFileChange = (file) => {
        if (file) {
            handleAttachmentChange(file.name, file);
        } else {
            handleAttachmentChange('', null);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };
    
    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        handleFileChange(selectedFile);
    };

    const handleAreaClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} (Opsional)
            </label>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInputChange} 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
            />

            {!hasFile ? (
                <div
                    className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleAreaClick}
                >
                    <Upload size={24} className={`text-gray-500 ${isDragging ? 'text-blue-600' : ''}`} />
                    <p className="mt-2 text-sm text-gray-600 font-medium">Seret dan Letakkan file di sini</p>
                    <p className="text-xs text-gray-500">(atau klik untuk memilih file)</p>
                </div>
            ) : (
                <div className="flex items-center justify-between p-3 mt-1 bg-white border border-green-400 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                        <FileText size={20} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-800 truncate">{fileName}</span>
                    </div>
                    <button
                        onClick={() => handleFileChange(null)}
                        className="text-red-500 hover:text-red-700 transition duration-150"
                        title="Hapus Lampiran"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};


const LaporanForm = ({ report, handleChange, handleSubmit, handleAttachmentChange, mode, setView, isLoading }) => {
    const isEdit = mode === 'edit';
    const title = isEdit ? `Edit Laporan HSE #${report._id}` : 'Formulir Laporan HSE Baru'; 

    const getStatusStyle = (status) => {
        if (status.includes('Ditolak')) return 'bg-red-100 text-red-700 ring-red-500';
        if (status.includes('Disetujui')) return 'bg-green-100 text-green-700 ring-green-500';
        if (status.includes('Menunggu')) return 'bg-yellow-100 text-yellow-700 ring-yellow-500';
        return 'bg-gray-100 text-gray-700 ring-gray-500';
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title={title} />
            <div className="w-full px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Formulir Input Utama */}
                    <div className="lg:col-span-2">
                        <Card title="Detail Insiden"> 
                            {isEdit && (
                                <div className={`text-sm font-semibold mb-6 p-2 rounded-lg ring-1 ${getStatusStyle(report.status)} flex items-center`}>
                                    <FileText size={16} className="mr-2" />
                                    Status Saat Ini: {report.status}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <FormInput
                                    label="Tanggal Kejadian"
                                    type="date"
                                    name="tanggalKejadian"
                                    value={report.tanggalKejadian}
                                    onChange={handleChange}
                                />
                                <FormInput
                                    label="Departemen Pekerja"
                                    type="select"
                                    name="department"
                                    value={report.department}
                                    onChange={handleChange}
                                    options={DEPARTMENTS}
                                />
                            </div>

                            <FormInput
                                label="Nama Pekerja Terlibat"
                                name="namaPekerja"
                                value={report.namaPekerja}
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Nomor Induk Pekerja (NIP)"
                                name="nomorIndukPekerja"
                                value={report.nomorIndukPekerja}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Kronologi Kejadian Rinci"
                                type="textarea"
                                name="detailKejadian"
                                value={report.detailKejadian}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Skala Cedera"
                                type="select"
                                name="skalaCedera"
                                value={report.skalaCedera}
                                onChange={handleChange}
                                options={SKALA_CEDERA}
                            />
                            
                            <FileUploadComponent
                                label="Lampiran Foto/Dokumen"
                                fileName={report.attachmentUrl}
                                handleAttachmentChange={handleAttachmentChange}
                            />
                            
                        </Card>
                    </div>

                    {/* Kolom Kanan: Investigasi & Tindakan (Hanya di Edit) */}
                    {isEdit && (
                        <div className="lg:col-span-1 space-y-8">
                            <Card title="Investigasi & Analisis"> 
                                <FormInput
                                    label="Akar Masalah (Root Cause)"
                                    type="textarea"
                                    name="investigasi"
                                    value={report.investigasi || ''}
                                    onChange={handleChange}
                                    isRequired={false}
                                />
                            </Card>

                            <Card title="Tindakan Korektif"> 
                                {report.tindakanKorektif && report.tindakanKorektif.length > 0 ? (
                                    <div className="space-y-4">
                                        {report.tindakanKorektif.map((t, index) => (
                                            <div key={index} className={`p-3 rounded-lg border ${t.status === 'Selesai' ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
                                                <p className="font-medium text-sm text-gray-800">{t.deskripsi}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <span className="font-semibold">PIC:</span> {t.penanggungJawab} | 
                                                    <span className="font-semibold ml-2">Batas Waktu:</span> {t.batasWaktu} | 
                                                    <span className="font-semibold ml-2">Status:</span> {t.status}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Belum ada tindakan korektif yang ditambahkan.</p>
                                )}
                                <button className="mt-4 w-full text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    + Tambah Tindakan Baru
                                </button>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Footer Aksi */}
                <Card className="fixed bottom-0 left-0 right-0 z-20 rounded-t-xl rounded-b-none shadow-2xl lg:shadow-none lg:relative lg:mt-8">
                    <div className="flex justify-end space-x-4">
                        {/* Batal kini mengarah ke Form Baru (sebagai fallback) */}
                        {isEdit && (
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-semibold"
                                onClick={() => setView('form')}
                                disabled={isLoading}
                            >
                                <CancelIcon size={18} className="inline mr-2" /> Batal
                            </button>
                        )}
                        <button
                            type="button"
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleSubmit(true)}
                            disabled={isLoading}
                        >
                             {isLoading ? <Loader2 size={18} className="inline mr-2 animate-spin" /> : <Save size={18} className="inline mr-2" />} Simpan Draft
                        </button>
                        <button
                            type="button"
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleSubmit(false)}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={18} className="inline mr-2 animate-spin" /> : <Send size={18} className="inline mr-2" />} {isEdit ? 'Perbarui & Kirim' : 'Kirim Laporan'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
    const [report, setReport] = useState(getDefaultReport());
    // Default view diubah menjadi 'form' karena tidak ada 'list'
    const [view, setView] = useState('form'); 
    const [attachmentFile, setAttachmentFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    
    // List-related states (reportList, currentStatus) dan handlers (setReportId, fetchLaporanList) dihapus

    // Mengambil data detail laporan saat beralih ke Edit View
    const fetchData = useCallback(async (id) => {
        setIsLoading(true);
        try {
            if (id) {
                // Dalam aplikasi nyata: const data = await getLaporanDetail(id);
                const data = getFakeReport(); // Simulasi
                setReport({ 
                    ...data,
                    investigasi: data.investigasi || getFakeReport().investigasi,
                    tindakanKorektif: data.tindakanKorektif || getFakeReport().tindakanKorektif,
                });
            } else {
                setReport(getDefaultReport());
                setAttachmentFile(null);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            // Fallback ke data palsu jika API gagal
            setReport(getFakeReport());
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === 'edit') {
            // Kita harus menentukan ID, jadi gunakan ID palsu untuk demo edit
            const idToFetch = report._id || getFakeReport()._id; 
            fetchData(idToFetch);
        } else if (view === 'form') {
            setReport(getDefaultReport());
            setAttachmentFile(null);
        }
        // Logika untuk 'list' telah dihapus
    }, [view, fetchData, report._id]);


    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setReport(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleAttachmentChange = useCallback((fileName, fileObject = null) => {
        setReport(prev => ({
            ...prev,
            attachmentUrl: fileName, 
        }));
        setAttachmentFile(fileObject);
    }, []);


    const handleSubmit = async(isDraft) => {
        if (isLoading) return;

        setIsLoading(true);
        const reportToSave = { ...report, isDraft };

        try {
            let response;
            if (report._id) {
                reportToSave.status = isDraft ? report.status : 'Menunggu Persetujuan Kepala Bidang';
                
                // --- API CALL SIMULATION START ---
                // response = await updateLaporanData(report._id, reportToSave, attachmentFile);
                response = { laporan: { ...reportToSave, _id: report._id }, message: 'Simulasi Update OK' }; // Simulasi
                
                if (!isDraft && report.isDraft) {
                    // response = await submitLaporanAPI(report._id);
                    response = { laporan: {...reportToSave, isDraft: false, status: 'Menunggu Persetujuan Kepala Bidang'}, message: 'Simulasi Submit OK' }; // Simulasi
                }

            } else {
                reportToSave.status = 'Draft';
                
                // response = await createLaporanDraft(reportToSave, attachmentFile);
                response = { _id: 'laporan_new_123', ...reportToSave, message: 'Simulasi Create OK' }; // Simulasi
            }
            // --- API CALL SIMULATION END ---
            
            console.log('API Success:', response);
            setReport(response.laporan || response); 
            // Setelah submit/simpan, pindah ke mode edit untuk laporan yang baru/diedit
            setView('edit'); 

            const action = isDraft ? 'Draft disimpan' : 'Laporan dikirim';
            console.log(`SUCCESS: ${action}`);

        } catch (error) {
            const msg = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan/server.';
            console.error('API Error:', msg);
            alert(`Gagal menyimpan laporan: ${msg}`);
            
        } finally {
            setIsLoading(false);
        }
    };


    // --- Logika Render untuk Tampilan Utama ---
    let CurrentView;
    // Hanya ada 'form' dan 'edit'
    CurrentView = (
        <LaporanForm
            report={report}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAttachmentChange={handleAttachmentChange}
            mode={view}
            setView={setView}
            isLoading={isLoading}
        />
    );

    // Tombol Navigasi Demo Disederhanakan
    const DemoNav = () => (
        <div className="fixed top-20 right-4 z-50 p-2 bg-blue-600 rounded-lg shadow-xl flex flex-col space-y-2 text-xs">
            <h3 className='text-white font-bold text-center'>Tampilan Demo</h3>
            <button className="bg-white px-3 py-1 rounded text-blue-600 hover:bg-gray-200" onClick={() => setView('form')}>+ Laporan Baru</button> 
            <button className="bg-white px-3 py-1 rounded text-blue-600 hover:bg-gray-200" onClick={() => setView('edit')}>Edit Laporan</button> 
        </div>
    );


    return (
        <div className="font-sans min-h-screen w-full">
            <DemoNav />
            {CurrentView}
            <div className="h-24 lg:hidden"></div>
        </div>
    );
};

export default App;