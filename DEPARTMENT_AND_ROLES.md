# 🏢 Department & Role Structure

## Overview Sistem

Sistem laporan kecelakaan ini dirancang dengan struktur multi-role dan multi-departemen untuk memastikan approval flow yang terstruktur dan akuntabel.

---

## 📊 Department Structure

Sistem mendukung **5 departemen** di Solanum Agrotech:

### 1. Mechanical Assembly
- Menangani perakitan komponen mekanik
- Kepala Bidang: Bertanggung jawab atas laporan dari divisi ini
- Risk Level: Medium-High (pekerjaan dengan machinery)

### 2. Electronical Assembly
- Menangani perakitan komponen elektronik
- Kepala Bidang: Bertanggung jawab atas laporan dari divisi ini
- Risk Level: Low-Medium (minimal hazard fisik)

### 3. Software Installation
- Menangani instalasi dan konfigurasi software
- Kepala Bidang: Bertanggung jawab atas laporan dari divisi ini
- Risk Level: Low (minimal physical hazard)

### 4. Quality Assurance
- Menangani quality control dan testing
- Kepala Bidang: Bertanggung jawab atas laporan dari divisi ini
- Risk Level: Low (testing dan documentation)

### 5. Warehouse
- Menangani penyimpanan dan distribusi material
- Kepala Bidang: Bertanggung jawab atas laporan dari divisi ini
- Risk Level: High (heavy lifting, material handling)

---

## 👥 Role Structure

### 1. HSE (Health, Safety & Environment)
**Responsibility:** Membuat dan mengelola laporan kecelakaan

#### Permissions:
- ✅ Create laporan baru (Draft)
- ✅ Edit draft laporan
- ✅ Upload attachment
- ✅ Submit laporan untuk approval
- ✅ Track status laporan
- ✅ View approved final documents
- ❌ Approve/Reject laporan
- ❌ View laporan departemen lain (hanya milik sendiri)

#### Dashboard:
- Halaman: `/dashboard/hse`
- Fitur: Form pembuatan laporan, tracking status, draft management

#### Approval Flow untuk HSE:
```
HSE Draft Report
      ↓
Submit to Kepala Bidang
      ↓
Track Status (Waiting → Approved/Rejected)
      ↓
View Final Document (if approved)
```

---

### 2. Kepala Bidang (Department Head)
**Responsibility:** Mereview dan approve laporan dari departemennya

#### Permissions:
- ✅ View laporan dari departemennya saja
- ✅ View detail laporan lengkap
- ✅ Approve laporan → forward ke Direktur
- ✅ Reject laporan → kembali ke HSE
- ✅ View history (approved & rejected)
- ✅ Filter laporan by status
- ❌ View laporan departemen lain
- ❌ Final approval (itu tugas Direktur)

#### Dashboard:
- Halaman: `/dashboard/kepala-bidang`
- Fitur: 
  - List laporan menunggu persetujuan
  - Detail modal
  - Approve/Reject buttons
  - Status filtering (Pending, Approved, Rejected)
  - Statistics dashboard

#### Approval Flow untuk Kepala Bidang:
```
Review Laporan
      ↓
      ├─→ APPROVE → Forward to Direktur → Email to HSE & Direktur
      │
      └─→ REJECT → Back to Draft → Email to HSE
```

#### Data Filtering:
Kepala Bidang hanya melihat laporan dengan:
- `department` = departemen yang sama dengan Kepala Bidang
- `status` = "Menunggu Persetujuan Kepala Bidang" OR sudah diproses

**Contoh:**
```javascript
// Jika Kepala Bidang memiliki department: "Mechanical Assembly"
// Maka hanya laporan dengan department: "Mechanical Assembly" yang tampil
Laporan.find({
  department: "Mechanical Assembly",
  status: { $in: [
    "Menunggu Persetujuan Kepala Bidang",
    "Disetujui",
    "Ditolak Kepala Bidang"
  ]}
})
```

---

### 3. Direktur SDM (Director of Human Resources)
**Responsibility:** Final approval untuk semua laporan kecelakaan

#### Permissions:
- ✅ View ALL laporan dari semua departemen
- ✅ View detail laporan lengkap
- ✅ Approve laporan → final approval
- ✅ Reject laporan → kembali ke HSE
- ✅ View history (approved & rejected)
- ✅ Filter laporan by status
- ❌ Edit laporan
- ❌ Delegate approval

#### Dashboard:
- Halaman: `/dashboard/direktur-sdm`
- Fitur:
  - List semua laporan menunggu persetujuan (dari semua departemen)
  - Detail modal + informasi Kepala Bidang yang approve sebelumnya
  - Approve/Reject buttons
  - Status filtering (Pending, Approved, Rejected)
  - Statistics dashboard

#### Approval Flow untuk Direktur:
```
Review Laporan (from all departments)
      ↓
      ├─→ APPROVE → Final Approval → Email to HSE
      │
      └─→ REJECT → Back to Draft → Email to HSE
```

#### Data Filtering:
Direktur SDM melihat semua laporan dengan:
- `status` = "Menunggu Persetujuan Direktur SDM" OR sudah diproses

```javascript
Laporan.find({
  status: { $in: [
    "Menunggu Persetujuan Direktur SDM",
    "Disetujui",
    "Ditolak Direktur SDM"
  ]}
})
```

---

### 4. Admin
**Responsibility:** Manajemen user dan sistem

#### Permissions:
- ✅ Create/Edit/Delete users
- ✅ Assign roles
- ✅ Assign departments
- ✅ View all users
- ✅ Reset passwords
- ❌ Approve/Reject laporan
- ❌ Modify approved documents

#### Dashboard:
- Halaman: `/dashboard/admin`
- Fitur: User management, role assignment, department assignment

---

## 🔄 Complete Approval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HSE - Create Report                          │
│  - Fill form (Worker, Date, Description, Injury Scale)         │
│  - Upload attachment (optional)                                 │
│  - Save as Draft OR Submit                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Status: Draft
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         HSE - Submit to Kepala Bidang (Change Status)           │
│  Status: "Menunggu Persetujuan Kepala Bidang"                  │
│  Email: Notif to Kepala Bidang & Direktur SDM                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────────┐                ┌──────────────────────┐
│   Kepala Bidang      │                │ Kepala Bidang Dapat   │
│   View Dashboard     │                │ melihat HANYA         │
│                      │                │ laporan departemennya │
│   - See pending      │                │ (Filter di backend)   │
│   - View detail      │                │                      │
│   - Approve/Reject   │                └──────────────────────┘
└──────────────────────┘
        ↓
        ├─────────────────────┬─────────────────────┐
        ↓                     ↓                     ↓
    APPROVE              REJECT                (Continue to next)
        │                   │
        ↓                   ↓
    Status:             Status:
 "Menunggu             "Ditolak Kabid"
 Direktur"             
        │                   │
        ├─ Email HSE        ├─ Email HSE
        ├─ Email Direktur   └─ (END FLOW)
        │
        ↓
┌──────────────────────┐
│   Direktur SDM       │
│   View Dashboard     │
│                      │
│   - See ALL pending  │
│   - View detail      │
│   - See Kabid info   │
│   - Approve/Reject   │
└──────────────────────┘
        ↓
        ├─────────────────────┬─────────────────────┐
        ↓                     ↓                     ↓
    APPROVE              REJECT                (Continue to next)
        │                   │
        ↓                   ↓
    Status:             Status:
 "Disetujui"          "Ditolak Direktur"
        │                   │
        ├─ Email HSE        ├─ Email HSE
        └─ (FINAL)          └─ (FINAL)
```

---

## 📋 Department Assignment Examples

### Mechanical Assembly
**Kepala Bidang:**
- Username: `kabid_mech`
- Department: `Mechanical Assembly`
- Can view: Reports from Mechanical Assembly ONLY
- Can approve: Laporan dari divisi Mechanical Assembly

### Electronical Assembly
**Kepala Bidang:**
- Username: `kabid_elec`
- Department: `Electronical Assembly`
- Can view: Reports from Electronical Assembly ONLY
- Can approve: Laporan dari divisi Electronical Assembly

### Other Departments
- Quality Assurance → `kabid_qa`
- Software Installation → `kabid_soft`
- Warehouse → `kabid_warehouse`

### Direktur SDM
**User:**
- Username: `direktur`
- Role: `direktur_sdm`
- Can view: ALL reports from ALL departments
- Can approve: Final approval untuk semua laporan

---

## 🔐 Access Control Matrix

| Feature | HSE | Kepala Bidang | Direktur SDM | Admin |
|---------|-----|---------------|--------------|-------|
| Create Report | ✅ | ❌ | ❌ | ❌ |
| View Own Reports | ✅ | ❌ | ❌ | ❌ |
| View Dept Reports | ❌ | ✅ | ❌ | ❌ |
| View All Reports | ❌ | ❌ | ✅ | ✅ |
| Approve Report | ❌ | ✅ | ✅ | ❌ |
| Reject Report | ❌ | ✅ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Assign Roles | ❌ | ❌ | ❌ | ✅ |
| Assign Dept | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Use Cases by Role

### HSE Use Case: "Create and Submit Report"
1. **Accident happens** → HSE notified
2. **HSE open app** → `/dashboard/hse/laporan`
3. **Fill report form**:
   - Nama Pegawai: "Ahmad"
   - NIP: "12345"
   - Department: "Mechanical Assembly"
   - Date: "2025-11-17"
   - Detail: "Terjepit di machinery"
   - Injury: "Berat"
   - Attachment: accident_photo.jpg
4. **Save as Draft** → Can edit later
5. **Submit** → Status: "Menunggu Persetujuan Kepala Bidang"
6. **Tracking** → View status real-time
7. **Result**:
   - If Approved by Kabid → Waiting for Direktur
   - If Rejected by Kabid → Back to Draft, can revise

### Kepala Bidang Use Case: "Review and Approve"
1. **Kepala Bidang login** → `/dashboard/kepala-bidang`
2. **See pending reports** → Only from Mechanical Assembly
3. **Click report** → View detail modal
4. **Review information**:
   - Worker info
   - Incident details
   - Attachment file
5. **Decision**:
   - If looks good → Click "Approve"
   - If needs revision → Click "Tolak"
6. **Result**:
   - If Approved → Status: "Menunggu Direktur"
   - Report moves to history
   - Email sent to HSE + Direktur

### Direktur SDM Use Case: "Final Approval"
1. **Direktur login** → `/dashboard/direktur-sdm`
2. **See pending reports** → From ALL departments
3. **Click report** → View detail + Kepala Bidang approval info
4. **Review**:
   - All information
   - Department
   - Injury scale
   - Kepala Bidang approval
5. **Decision**:
   - If approved by Kabid and looks good → Click "Approve"
   - If concerns → Click "Tolak"
6. **Result**:
   - If Approved → Status: "Disetujui" (FINAL)
   - Report moves to history
   - Email sent to HSE
   - Document ready for archive

---

## 🔗 Related Documents

- **DASHBOARD_DOCUMENTATION.md** - Technical documentation
- **QUICK_START.md** - Testing guide with sample accounts
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **README.md** - Overall project overview

---

## 💡 Key Design Decisions

### 1. Department-based Filtering for Kepala Bidang
- **Why:** Ensures Kepala Bidang only manages their own department
- **How:** Filter implemented at backend (cannot bypass from frontend)
- **Benefit:** Security & simplicity of dashboard

### 2. All-Reports Access for Direktur SDM
- **Why:** Direktur needs oversight of all incidents
- **How:** No department filter, only status filter
- **Benefit:** Central visibility for final decision

### 3. Status-based UI Behavior
- **Why:** Users should only see actionable items
- **How:** Buttons disabled on already-processed reports
- **Benefit:** Prevents duplicate approvals

### 4. Email Notifications at Each Step
- **Why:** Transparency and accountability
- **How:** Automated emails sent on approval/rejection
- **Benefit:** Users informed without checking dashboard

---

## 🚀 Future Enhancements

1. **Sub-departments** - More granular control within departments
2. **Delegation** - Allow Kepala Bidang to delegate approval
3. **Escalation** - Auto-escalate if approval takes too long
4. **Comments** - Add comments/notes during approval
5. **Analytics** - Department-level injury statistics
6. **Compliance Reports** - Auto-generate compliance reports
7. **SLA Tracking** - Track approval time SLAs
8. **Integration** - Connect to HR/Safety systems

---

Generated: November 17, 2025  
Version: 1.0  
Status: Complete ✅
