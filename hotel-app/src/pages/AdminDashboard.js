import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { 
  getAllReservations, 
  createReservation, 
  updateReservation, 
  updateReservationStatus, 
  uploadReservationDocument, 
  deleteReservation,
  getAllRooms,
  createRoom,
  updateRoom,
  uploadRoomImage,
  deleteRoom,
  getFileUrl
} from "../services/api";
import { 
  DollarSign, 
  Users, 
  Hotel, 
  CheckCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Search, 
  FileText, 
  RefreshCw,
  Eye,
  Filter,
  X
} from "lucide-react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reservations"); // reservations | rooms | uploads
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [showResModal, setShowResModal] = useState(false);
  const [editingRes, setEditingRes] = useState(null);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null); // { type: 'res'|'room', id: number }
  const [selectedFile, setSelectedFile] = useState(null);

  // Form states
  const [resForm, setResForm] = useState({
    guestName: "",
    guestEmail: "",
    contactNumber: "",
    roomNumber: "",
    roomType: "Deluxe Sea View Suite",
    checkInDate: "",
    checkOutDate: "",
    totalPrice: 200,
    status: "CONFIRMED",
    specialRequests: ""
  });

  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    roomType: "Deluxe Suite",
    pricePerNight: 150,
    capacity: 2,
    status: "AVAILABLE",
    description: "",
    amenities: "WiFi, Air Conditioning, TV",
    imageUrl: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, roomData] = await Promise.all([
        getAllReservations(),
        getAllRooms()
      ]);
      setReservations(resData.data || []);
      setRooms(roomData.data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showToast("Error connecting to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactNumber?.includes(searchTerm) ||
      String(r.roomNumber).includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalRevenue = reservations
    .filter(r => r.status !== "CANCELLED")
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const activeCount = reservations.filter(r => r.status === "CONFIRMED" || r.status === "CHECKED_IN").length;
  const availableRoomsCount = rooms.filter(r => r.status === "AVAILABLE").length;
  const occupancyRate = rooms.length ? Math.round(((rooms.length - availableRoomsCount) / rooms.length) * 100) : 0;

  // --- RESERVATION CRUD HANDLERS ---
  const handleOpenResModal = (res = null) => {
    if (res) {
      setEditingRes(res);
      setResForm({
        guestName: res.guestName || "",
        guestEmail: res.guestEmail || "",
        contactNumber: res.contactNumber || "",
        roomNumber: res.roomNumber || "",
        roomType: res.roomType || "Deluxe Suite",
        checkInDate: res.checkInDate || "",
        checkOutDate: res.checkOutDate || "",
        totalPrice: res.totalPrice || 200,
        status: res.status || "CONFIRMED",
        specialRequests: res.specialRequests || ""
      });
    } else {
      setEditingRes(null);
      setResForm({
        guestName: "",
        guestEmail: "",
        contactNumber: "",
        roomNumber: rooms.length > 0 ? rooms[0].roomNumber : 101,
        roomType: "Deluxe Sea View Suite",
        checkInDate: new Date().toISOString().split("T")[0],
        checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        totalPrice: 450,
        status: "CONFIRMED",
        specialRequests: ""
      });
    }
    setShowResModal(true);
  };

  const handleSaveRes = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...resForm,
        roomNumber: parseInt(resForm.roomNumber),
        totalPrice: parseFloat(resForm.totalPrice)
      };

      if (editingRes) {
        await updateReservation(editingRes.reservationId, payload);
        showToast(`Reservation #${editingRes.reservationId} updated successfully!`);
      } else {
        await createReservation(payload);
        showToast("New Reservation created successfully!");
      }
      setShowResModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast("Failed to save reservation details.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      showToast(`Reservation #${id} status changed to ${newStatus}`);
      fetchData();
    } catch (err) {
      showToast("Error updating status");
    }
  };

  const handleDeleteRes = async (id) => {
    if (window.confirm(`Are you sure you want to delete Reservation #${id}?`)) {
      try {
        await deleteReservation(id);
        showToast(`Reservation #${id} deleted.`);
        fetchData();
      } catch (err) {
        showToast("Failed to delete reservation.");
      }
    }
  };

  // --- ROOM CRUD HANDLERS ---
  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        status: room.status,
        description: room.description || "",
        amenities: room.amenities || "",
        imageUrl: room.imageUrl || ""
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        roomNumber: Math.floor(100 + Math.random() * 800),
        roomType: "Executive King Suite",
        pricePerNight: 200,
        capacity: 2,
        status: "AVAILABLE",
        description: "Modern suite with panoramic window and luxury amenities.",
        amenities: "WiFi, Air Conditioning, TV, Mini Bar",
        imageUrl: ""
      });
    }
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...roomForm,
        roomNumber: parseInt(roomForm.roomNumber),
        pricePerNight: parseFloat(roomForm.pricePerNight),
        capacity: parseInt(roomForm.capacity)
      };

      if (editingRoom) {
        await updateRoom(editingRoom.roomId, payload);
        showToast(`Room #${editingRoom.roomNumber} updated!`);
      } else {
        await createRoom(payload);
        showToast(`Room #${payload.roomNumber} created!`);
      }
      setShowRoomModal(false);
      fetchData();
    } catch (err) {
      showToast("Failed to save room.");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm(`Are you sure you want to delete Room ID #${id}?`)) {
      try {
        await deleteRoom(id);
        showToast("Room deleted.");
        fetchData();
      } catch (err) {
        showToast("Failed to delete room.");
      }
    }
  };

  // --- FILE UPLOAD HANDLER ---
  const handleOpenUpload = (type, id) => {
    setUploadTarget({ type, id });
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleExecuteUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      if (uploadTarget.type === "res") {
        await uploadReservationDocument(uploadTarget.id, formData);
        showToast(`Document uploaded for Reservation #${uploadTarget.id}!`);
      } else if (uploadTarget.type === "room") {
        await uploadRoomImage(uploadTarget.id, formData);
        showToast(`Image uploaded for Room #${uploadTarget.id}!`);
      }
      setShowUploadModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast("File upload failed.");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="main-content">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="toast-alert">
            <CheckCircle size={18} color="var(--primary-gold)" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="section-header" style={{ marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Admin Operations Console</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Complete CRUD management & document vault for rooms and guest reservations
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-outline" onClick={fetchData}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn btn-gold" onClick={() => handleOpenResModal()}>
              <Plus size={16} /> New Reservation
            </button>
            <button className="btn btn-outline" onClick={() => handleOpenRoomModal()}>
              <Plus size={16} /> Add Room
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-info">
              <h4>Total Revenue</h4>
              <div className="metric-value">${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="metric-icon icon-gold">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Active Bookings</h4>
              <div className="metric-value">{activeCount}</div>
            </div>
            <div className="metric-icon icon-blue">
              <Users size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Available Rooms</h4>
              <div className="metric-value">{availableRoomsCount} / {rooms.length}</div>
            </div>
            <div className="metric-icon icon-emerald">
              <Hotel size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Occupancy Rate</h4>
              <div className="metric-value">{occupancyRate}%</div>
            </div>
            <div className="metric-icon icon-purple">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === "reservations" ? "active" : ""}`}
            onClick={() => setActiveTab("reservations")}
          >
            Reservations Management ({reservations.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "rooms" ? "active" : ""}`}
            onClick={() => setActiveTab("rooms")}
          >
            Rooms Catalog CRUD ({rooms.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "uploads" ? "active" : ""}`}
            onClick={() => setActiveTab("uploads")}
          >
            Document & Photo Vault
          </button>
        </div>

        {/* TAB 1: RESERVATIONS CRUD */}
        {activeTab === "reservations" && (
          <div className="section-card">
            {/* Search & Filter Bar */}
            <div className="section-header" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
              <div style={{ position: "relative", minWidth: "280px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search guest name, room, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "36px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <Filter size={16} color="var(--text-muted)" />
                {["ALL", "CONFIRMED", "CHECKED_IN", "PENDING", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm ${statusFilter === st ? "btn-gold" : "btn-outline"}`}
                    style={{ fontSize: "0.75rem", padding: "5px 10px" }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Reservations Data Table */}
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading reservations...</div>
            ) : filteredReservations.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No reservations found matching your criteria.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Guest Details</th>
                      <th>Room</th>
                      <th>Dates</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Doc Attachment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((r) => (
                      <tr key={r.reservationId}>
                        <td style={{ fontWeight: 700, color: "var(--primary-gold)" }}>#{r.reservationId}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.guestName}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {r.contactNumber} {r.guestEmail ? `• ${r.guestEmail}` : ""}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700 }}>Room {r.roomNumber}</span>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.roomType || "Standard"}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.82rem" }}>
                            {r.checkInDate || "N/A"} → {r.checkOutDate || "N/A"}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>${r.totalPrice || 0}</td>
                        <td>
                          <span className={`badge badge-${r.status?.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.documentUrl ? (
                            <a 
                              href={getFileUrl(r.documentUrl)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="btn btn-outline btn-sm"
                              style={{ padding: "3px 8px", fontSize: "0.75rem" }}
                            >
                              <FileText size={12} /> View File
                            </a>
                          ) : (
                            <button
                              onClick={() => handleOpenUpload("res", r.reservationId)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: "3px 8px", fontSize: "0.75rem", color: "var(--primary-gold)" }}
                            >
                              <Upload size={12} /> Upload ID
                            </button>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <select
                              value={r.status}
                              onChange={(e) => handleStatusChange(r.reservationId, e.target.value)}
                              style={{ width: "auto", padding: "4px 8px", fontSize: "0.75rem" }}
                            >
                              <option value="CONFIRMED">Confirm</option>
                              <option value="CHECKED_IN">Check In</option>
                              <option value="CHECKED_OUT">Check Out</option>
                              <option value="CANCELLED">Cancel</option>
                            </select>
                            <button
                              onClick={() => handleOpenResModal(r)}
                              className="btn btn-outline btn-sm"
                              title="Edit Reservation"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRes(r.reservationId)}
                              className="btn btn-danger btn-sm"
                              title="Delete Reservation"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROOMS CATALOG CRUD */}
        {activeTab === "rooms" && (
          <div>
            <div className="section-header" style={{ marginBottom: "16px" }}>
              <h2 className="section-title">Hotel Room Inventory</h2>
              <button className="btn btn-gold" onClick={() => handleOpenRoomModal()}>
                <Plus size={16} /> Create New Room
              </button>
            </div>

            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.roomId} className="room-card">
                  <img
                    src={room.imageUrl ? getFileUrl(room.imageUrl) : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                    alt={room.roomType}
                    className="room-image"
                  />
                  <div className="room-details">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 800, color: "var(--primary-gold)" }}>Room #{room.roomNumber}</span>
                      <span className={`badge badge-${room.status?.toLowerCase()}`}>{room.status}</span>
                    </div>

                    <div className="room-type">{room.roomType}</div>
                    <div className="room-price">${room.pricePerNight} <span>/ night</span></div>
                    <div className="room-desc">{room.description}</div>

                    <div className="amenities-list">
                      {(room.amenities || "").split(",").map((am, idx) => (
                        <span key={idx} className="amenity-chip">{am.trim()}</span>
                      ))}
                    </div>

                    <div style={{ marginTop: "auto", display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenUpload("room", room.roomId)}
                      >
                        <Upload size={12} /> Upload Photo
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenRoomModal(room)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteRoom(room.roomId)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: UPLOAD CENTER */}
        {activeTab === "uploads" && (
          <div className="section-card">
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Document & Image Storage Vault</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              Uploaded files stored locally in Spring Boot backend and served securely via REST API endpoints.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {reservations.filter(r => r.documentUrl).map(r => (
                <div key={`doc-${r.reservationId}`} style={{ background: "rgba(15,23,42,0.6)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <FileText size={24} color="var(--primary-gold)" />
                    <div>
                      <div style={{ fontWeight: 700 }}>Guest ID: {r.guestName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Reservation #{r.reservationId}</div>
                    </div>
                  </div>
                  <a href={getFileUrl(r.documentUrl)} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm" style={{ width: "100%" }}>
                    <Eye size={14} /> Open Document
                  </a>
                </div>
              ))}

              {rooms.filter(rm => rm.imageUrl && rm.imageUrl.startsWith("/api/files")).map(rm => (
                <div key={`img-${rm.roomId}`} style={{ background: "rgba(15,23,42,0.6)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <img src={getFileUrl(rm.imageUrl)} alt="Uploaded Room" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }} />
                  <div style={{ fontWeight: 700 }}>Room #{rm.roomNumber} Custom Photo</div>
                  <a href={getFileUrl(rm.imageUrl)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: "8px" }}>
                    <Eye size={14} /> View Image
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MODAL: CREATE / EDIT RESERVATION --- */}
        {showResModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  {editingRes ? `Edit Reservation #${editingRes.reservationId}` : "Create New Reservation"}
                </h3>
                <button onClick={() => setShowResModal(false)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveRes} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Guest Name *</label>
                  <input
                    required
                    value={resForm.guestName}
                    onChange={(e) => setResForm({ ...resForm, guestName: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email</label>
                    <input
                      type="email"
                      value={resForm.guestEmail}
                      onChange={(e) => setResForm({ ...resForm, guestEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Contact Number *</label>
                    <input
                      required
                      value={resForm.contactNumber}
                      onChange={(e) => setResForm({ ...resForm, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room Number *</label>
                    <input
                      type="number"
                      required
                      value={resForm.roomNumber}
                      onChange={(e) => setResForm({ ...resForm, roomNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room Type</label>
                    <select
                      value={resForm.roomType}
                      onChange={(e) => setResForm({ ...resForm, roomType: e.target.value })}
                    >
                      <option value="Deluxe Sea View Suite">Deluxe Sea View Suite</option>
                      <option value="Executive King Suite">Executive King Suite</option>
                      <option value="Presidential Royal Penthouse">Presidential Royal Penthouse</option>
                      <option value="Garden Villa Suite">Garden Villa Suite</option>
                      <option value="Standard Twin Room">Standard Twin Room</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Check-In Date</label>
                    <input
                      type="date"
                      value={resForm.checkInDate}
                      onChange={(e) => setResForm({ ...resForm, checkInDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Check-Out Date</label>
                    <input
                      type="date"
                      value={resForm.checkOutDate}
                      onChange={(e) => setResForm({ ...resForm, checkOutDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Price ($)</label>
                    <input
                      type="number"
                      value={resForm.totalPrice}
                      onChange={(e) => setResForm({ ...resForm, totalPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status</label>
                    <select
                      value={resForm.status}
                      onChange={(e) => setResForm({ ...resForm, status: e.target.value })}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CHECKED_IN">CHECKED_IN</option>
                      <option value="CHECKED_OUT">CHECKED_OUT</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ marginTop: "10px" }}>
                  Save Reservation
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: CREATE / EDIT ROOM --- */}
        {showRoomModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : "Add New Room"}
                </h3>
                <button onClick={() => setShowRoomModal(false)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveRoom} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room Number *</label>
                    <input
                      type="number"
                      required
                      value={roomForm.roomNumber}
                      onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room Type *</label>
                    <input
                      required
                      value={roomForm.roomType}
                      onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Price / Night ($)</label>
                    <input
                      type="number"
                      required
                      value={roomForm.pricePerNight}
                      onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Capacity</label>
                    <input
                      type="number"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status</label>
                    <select
                      value={roomForm.status}
                      onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Description</label>
                  <textarea
                    rows={3}
                    value={roomForm.description}
                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Amenities (comma separated)</label>
                  <input
                    value={roomForm.amenities}
                    onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ marginTop: "10px" }}>
                  Save Room
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: FILE UPLOAD --- */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "450px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Upload File to Server
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleExecuteUpload} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Select an image (PNG, JPG) or document (PDF) to attach to {uploadTarget?.type === "res" ? `Reservation #${uploadTarget.id}` : `Room #${uploadTarget.id}`}.
                </p>

                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ padding: "8px" }}
                />

                <button type="submit" className="btn btn-gold">
                  <Upload size={16} /> Upload Now
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;