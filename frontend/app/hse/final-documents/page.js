"use client";

import { getFinalDocuments, downloadFinalDocument } from '@/services/documentService'; 
import React, { useState, useEffect } from 'react';

function useFinalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFinalDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Gagal mengambil dokumen final:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); 
  return { documents, loading };
}

export default function FinalDocumentsPage() { 
  const { documents, loading } = useFinalDocuments();
  
  if (loading) {
    return (
      <div>
        <h1>Daftar Dokumen Final (Role HSE)</h1>
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div>
        <h1>Daftar Dokumen Final (Role HSE)</h1> 

        {documents.length > 0 ? (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th>No.</th>
                <th>Nama Pekerja</th>
                <th>Tanggal Kejadian</th>
                <th>Departemen</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            {documents.map((doc, index) => (
                <tr key={doc._id}>
                <td>{index + 1}</td>
                <td>{doc.namaPekerja}</td>
                <td>{new Date(doc.tanggalKejadian).toLocaleDateString('id-ID')}</td>
                <td>{doc.department}</td>
                <td>
                    {}
                    <button onClick={() => downloadFinalDocument(doc.id)}>
                    Download PDF
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p>Tidak Ada Dokumen Final</p>
        )}
    </div>
    );
}