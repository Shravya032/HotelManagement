import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { 
  getAvailableRooms, 
  createReservation, 
  getReservationsByGuest, 
  updateReservationStatus, 
  uploadReservationDocument, 
  getFileUrl 
} from "../services/api";
import { 
  Calendar, 
  Key, 
  CheckCircle, 
  Upload, 
  XCircle, 
  FileText, 
  Sparkles, 
  X 
} from "lucide-react";

function UserDashboard() {
  const { user } = useAuth();
  const guestName = user?.username || "Guest User";

  const [activeTab, setActiveTab] = useState("browse"); // browse | my-bookings
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");

  // Modals
  const [bookingRoom, setBookingRoom] = useState(null); // room object to book
  const [editingBooking, setEditingBooking] = useState(null);
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [uploadResId, setUploadResId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Booking Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const threeDaysStr = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

  const [bookingForm, setBookingForm] = useState({
    guestName: guestName,
    guestEmail: user?.email || "guest@example.com",
    contactNumber: "9876543210",
    checkInDate: todayStr,
    checkOutDate: threeDaysStr,
    specialRequests: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        getAvailableRooms(),
        getReservationsByGuest(guestName)
      ]);
      setRooms(roomsRes.data || []);
      setMyBookings(bookingsRes.data || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [guestName]);

  // Calculate dynamic nights & price for room booking
  const calculatePrice = (room, checkIn, checkOut) => {
    if (!room || !checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.max(0, end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return days * (room.pricePerNight || 150);
  };

  // Open booking modal for a specific room
  const handleOpenBookingModal = (room) => {
    setBookingRoom(room);
    setBookingForm({
      guestName: guestName,
      guestEmail: user?.email || "guest@example.com",
      contactNumber: "9876543210",
      checkInDate: todayStr,
      checkOutDate: threeDaysStr,
      specialRequests: ""
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingRoom) return;

    const totalPrice = calculatePrice(bookingRoom, bookingForm.checkInDate, bookingForm.checkOutDate);

    try {
      const payload = {
        guestName: bookingForm.guestName,
        guestEmail: bookingForm.guestEmail,
        contactNumber: bookingForm.contactNumber,
        roomNumber: bookingRoom.roomNumber,
        roomType: bookingRoom.roomType,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        totalPrice: totalPrice,
        status: "CONFIRMED",
        specialRequests: bookingForm.specialRequests
      };

      await createReservation(payload);
      showToast(`Reservation for ${bookingRoom.roomType} confirmed!`);
      setBookingRoom(null);
      setActiveTab("my-bookings");
      fetchData();
    } catch (err) {
      showToast("Error creating reservation.");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateReservationStatus(id, "CANCELLED");
        showToast(`Booking #${id} cancelled.`);
        fetchData();
      } catch (err) {
        showToast("Failed to cancel booking.");
      }
    }
  };

  const handleUploadIdProof = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadResId) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await uploadReservationDocument(uploadResId, formData);
      showToast(`ID proof attached for Booking #${uploadResId}!`);
      setUploadResId(null);
      fetchData();
    } catch (err) {
      showToast("Failed to upload ID proof.");
    }
  };

  const filteredRooms = rooms.filter(
    (r) => selectedRoomType === "ALL" || r.roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
  );

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

        {/* Welcome Header */}
        <div 
          className="section-card" 
          style={{ 
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.9))",
            border: "1px solid var(--border-gold)",
            marginBottom: "24px" 
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={20} color="var(--primary-gold)" />
                <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Welcome back, {guestName}!</h1>
              </div>
              <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "0.9rem" }}>
                Discover our hand-crafted luxury suites and manage your upcoming stays seamlessly.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-gold" onClick={() => setActiveTab("browse")}>
                <Key size={16} /> Browse Rooms
              </button>
              <button className="btn btn-outline" onClick={() => setActiveTab("my-bookings")}>
                <Calendar size={16} /> My Bookings ({myBookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            Available Rooms & Suites ({rooms.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "my-bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("my-bookings")}
          >
            My Reservations ({myBookings.length})
          </button>
        </div>

        {/* TAB 1: BROWSE & BOOK ROOMS */}
        {activeTab === "browse" && (
          <div>
            <div className="section-header" style={{ marginBottom: "20px" }}>
              <h2 className="section-title">Select Your Luxury Experience</h2>

              {/* Room Filter Pills */}
              <div style={{ display: "flex", gap: "8px" }}>
                {["ALL", "Deluxe", "Executive", "Penthouse", "Villa"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedRoomType(type)}
                    className={`btn btn-sm ${selectedRoomType === type ? "btn-gold" : "btn-outline"}`}
                    style={{ fontSize: "0.78rem" }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No rooms available for the selected category.
              </div>
            ) : (
              <div className="rooms-grid">
                {filteredRooms.map((room) => (
                  <div key={room.roomId} className="room-card">
                    <img
                      src={room.imageUrl ? getFileUrl(room.imageUrl) : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                      alt={room.roomType}
                      className="room-image"
                    />
                    <div className="room-details">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 800, color: "var(--primary-gold)" }}>Room #{room.roomNumber}</span>
                        <span className="badge badge-available">AVAILABLE</span>
                      </div>

                      <div className="room-type">{room.roomType}</div>
                      <div className="room-price">${room.pricePerNight} <span>/ night</span></div>
                      <div className="room-desc">{room.description}</div>

                      <div className="amenities-list">
                        {(room.amenities || "").split(",").map((am, idx) => (
                          <span key={idx} className="amenity-chip">{am.trim()}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleOpenBookingModal(room)}
                        className="btn btn-gold"
                        style={{ marginTop: "auto", width: "100%" }}
                      >
                        <Key size={16} /> Reserve Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "my-bookings" && (
          <div className="section-card">
            <h2 className="section-title" style={{ marginBottom: "20px" }}>My Hotel Bookings</h2>

            {myBookings.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>You have no active bookings at the moment.</p>
                <button className="btn btn-gold" onClick={() => setActiveTab("browse")}>
                  Browse & Reserve A Room
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {myBookings.map((b) => (
                  <div key={b.reservationId} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontWeight: 800, color: "var(--primary-gold)" }}>Booking #{b.reservationId}</span>
                      <span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span>
                    </div>

                    <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>{b.roomType || `Room ${b.roomNumber}`}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "14px" }}>Room #{b.roomNumber}</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.82rem", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", marginBottom: "14px" }}>
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block" }}>Check In</span>
                        <strong>{b.checkInDate || "N/A"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block" }}>Check Out</span>
                        <strong>{b.checkOutDate || "N/A"}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Paid</span>
                      <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)" }}>${b.totalPrice || 0}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {b.documentUrl ? (
                        <a href={getFileUrl(b.documentUrl)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                          <FileText size={14} /> View Attached ID Proof
                        </a>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => setUploadResId(b.reservationId)}>
                          <Upload size={14} /> Upload ID Proof (Passport/Aadhaar)
                        </button>
                      )}

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => setReceiptBooking(b)}>
                          <FileText size={14} /> View Invoice
                        </button>
                        {b.status !== "CANCELLED" && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.reservationId)}>
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- MODAL: ROOM BOOKING --- */}
        {bookingRoom && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Reserve {bookingRoom.roomType}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--primary-gold)" }}>Room #{bookingRoom.roomNumber} • ${bookingRoom.pricePerNight}/night</div>
                </div>
                <button onClick={() => setBookingRoom(null)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Guest Name</label>
                  <input
                    required
                    value={bookingForm.guestName}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Contact Number *</label>
                    <input
                      required
                      value={bookingForm.contactNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, contactNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email</label>
                    <input
                      type="email"
                      value={bookingForm.guestEmail}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Check-In Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.checkInDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Check-Out Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Special Requests</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Airport shuttle, early check-in, high floor"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  />
                </div>

                {/* Live Price Calculator Summary */}
                <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid var(--border-gold)", padding: "16px", borderRadius: "10px", marginTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Calculated Total Amount:</span>
                    <strong style={{ fontSize: "1.4rem", color: "var(--primary-gold)" }}>
                      ${calculatePrice(bookingRoom, bookingForm.checkInDate, bookingForm.checkOutDate)}
                    </strong>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Includes taxes, luxury room amenities, and complimentary breakfast.
                  </span>
                </div>

                <button type="submit" className="btn btn-gold" style={{ marginTop: "10px" }}>
                  Confirm Booking Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: UPLOAD ID PROOF --- */}
        {uploadResId && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "450px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Upload ID Document</h3>
                <button onClick={() => setUploadResId(null)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUploadIdProof} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Upload a clear image or PDF of your Passport / Government ID for Booking #{uploadResId}.
                </p>

                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ padding: "8px" }}
                />

                <button type="submit" className="btn btn-gold">
                  <Upload size={16} /> Submit ID Proof
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: INVOICE / RECEIPT VIEW --- */}
        {receiptBooking && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "500px", border: "1px solid var(--border-gold)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary-gold)" }}>
                  GRAND HORIZON INVOICE
                </h3>
                <button onClick={() => setReceiptBooking(null)} className="btn btn-outline btn-sm">
                  <X size={16} />
                </button>
              </div>

              <div style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>RESERVATION NO.</span>
                    <div style={{ fontWeight: 800 }}>#{receiptBooking.reservationId}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>STATUS</span>
                    <div><span className={`badge badge-${receiptBooking.status?.toLowerCase()}`}>{receiptBooking.status}</span></div>
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>GUEST NAME</span>
                  <div style={{ fontWeight: 700 }}>{receiptBooking.guestName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{receiptBooking.contactNumber}</div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>ACCOMMODATION</span>
                  <div style={{ fontWeight: 700 }}>{receiptBooking.roomType || `Room ${receiptBooking.roomNumber}`}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Room #{receiptBooking.roomNumber}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>CHECK-IN</span>
                    <div style={{ fontWeight: 700 }}>{receiptBooking.checkInDate || "N/A"}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>CHECK-OUT</span>
                    <div style={{ fontWeight: 700 }}>{receiptBooking.checkOutDate || "N/A"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700 }}>TOTAL AMOUNT PAID</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-gold)" }}>
                    ${receiptBooking.totalPrice || 0}
                  </span>
                </div>
              </div>

              <button className="btn btn-gold" style={{ width: "100%", marginTop: "16px" }} onClick={() => window.print()}>
                Print Invoice Summary
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;