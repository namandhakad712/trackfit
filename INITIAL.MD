

### **User Flow Diagram: QR Code Tracking System for Indian Railways**  
*(Based on your webapp plan)*  

---

#### **1. Depot Manager (Creator) Flow**  
```mermaid
graph TD
    A[Login: Depot Manager] --> B[Dashboard]
    B --> C[Quick Actions]
    C --> D[Add New Fitting]
    D --> E[Fill Form: Part Type, Manufacturer, Lot, Supply Date, Warranty]
    E --> F[Generate QR Code]
    F --> G[Save to Supabase]
    G --> H[Display QR for Printing]
    H --> I[Attach QR to Physical Fitting]
    
    B --> J[Scan QR Code]
    J --> K[View Fitting Details]
    K --> L[Add Inspection]
    L --> M[Log Status/Notes/Location]
    M --> N[AI Alert: Warranty/Quality Issue]
    N --> O[Sync with Mock UDM/TMS]
```

---

#### **2. Track Checker (Inspector) Flow**  
```mermaid
graph TD
    P[Login: Inspector] --> Q[Dashboard]
    Q --> R[Scan QR Code]
    R --> S[Scan Fitting in Field]
    S --> T[Fitting Details Page]
    T --> U[View: Manufacturer, Lot, Warranty]
    U --> V[Add Inspection]
    V --> W[Select Status: Pass/Fail/Needs Attention]
    W --> X[Add Notes + GPS Location]
    X --> Y[Submit to Supabase]
    Y --> Z[AI Alert: e.g., 'Replace in 30 Days']
    Z --> AA[Mock UDM Sync: Vendor Data Updated]
```

---

#### **3. Shared Flow: Dashboard & Alerts**  
```mermaid
graph LR
    BB[Dashboard] --> CC[Metrics: Total Fittings, Inspections]
    CC --> DD[Alerts: Warranty Expiry, Vendor Issues]
    DD --> EE[Quick Actions: Scan, Add Fitting, New Inspection]
    EE --> FF[View Fittings List]
    FF --> GG[Filter: Part Type, Manufacturer]
    GG --> HH[View Inspections List]
    HH --> II[Filter: Status, Date]
```

---

### **Key Flow Details**  
#### **1. Depot Manager (Creator)**  
- **Critical Path**:  
  `Login → Add Fitting → Generate QR → Print → Attach to Fitting`  
- **AI Integration**:  
  - Auto-alerts if warranty < 3 months  
  - Vendor quality flags (e.g., "Vendor ABC: 20% failure rate")  

#### **2. Track Checker (Inspector)**  
- **Critical Path**:  
  `Login → Scan QR → Log Inspection → Get AI Alert → Sync UDM`  
- **AI Integration**:  
  - Predictive alerts: "High failure risk for this lot"  
  - Location-based warnings: "This track section has 5 failed fittings"  

#### **3. System-Wide Features**  
- **Mock UDM/TMS Sync**:  
  - When fitting saved → Auto-update vendor data in `mock_udm_tms_data` table  
- **QR Data Structure**:  
  ```
  [Part Type]-[Manufacturer]-[Lot Number]-[Timestamp]
  Example: clip-ABC-123-1703078400
  ```

---

### **Edge Cases & Error Handling**  
| **Scenario**               | **System Response**                                  |  
|----------------------------|------------------------------------------------------|  
| Invalid QR scan            | Show error: "Invalid QR. Try again."                 |  
| Duplicate QR code          | Block creation: "QR already exists."                 |  
| Warranty expired           | Alert: "EXPIRED - Replace immediately"              |  
| Offline during inspection  | Save locally → Sync when online (future enhancement)|  

---

### **Implementation Priority for AI Coder**  
1. **Core Flow (Must-Have)**:  
   - Depot Manager: `Add Fitting → Generate QR → Save`  
   - Inspector: `Scan QR → Log Inspection → Alert`  
2. **AI Alerts (High-Impact)**:  
   - Warranty expiry checks  
   - Vendor failure rate warnings  
3. **Mock Integration (Demo-Ready)**:  
   - Static UDM/TMS sync simulation  

**Pro Tip**: Focus on the **scan → inspect → alert** loop. This is what judges will test. The Depot Manager flow is secondary for the demo.




-----------------------------------------------------------------
SUPABASE
project-url=https://vtcsqfovdqevbazuxpcr.supabase.co
api key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3NxZm92ZHFldmJhenV4cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODkyMTAsImV4cCI6MjA3NTE2NTIxMH0.XIMHVwKs5g0w9XsTv86egSL7jhsy0XlJVyhupltT2Mc
