
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import {
  getAvailableRooms,
  getAvailableRoomsForDates,
  createReservation,
  getReservationsByUser,
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

  const guestName =
    user?.username || "Guest User";

  const username =
    user?.username || "";

  const [activeTab, setActiveTab] =
    useState("browse");

  const [rooms, setRooms] =
    useState([]);

  const [myBookings, setMyBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [selectedRoomType, setSelectedRoomType] =
    useState("ALL");

  const [toastMessage, setToastMessage] =
    useState("");

  // Booking modal
  const [bookingRoom, setBookingRoom] =
    useState(null);

  // Receipt modal
  const [receiptBooking, setReceiptBooking] =
    useState(null);

  // Upload ID
  const [uploadResId, setUploadResId] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDateAfterDays = (days) => {
    const date = new Date();

    date.setDate(
      date.getDate() + days
    );

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayStr = getToday();

  const threeDaysStr =
    getDateAfterDays(3);

  // --------------------------------------------------
  // BOOKING FORM
  // --------------------------------------------------

  const [bookingForm, setBookingForm] =
    useState({
      guestName: guestName,
      guestEmail:
        user?.email ||
        "guest@example.com",
      contactNumber: "9876543210",
      checkInDate: todayStr,
      checkOutDate: threeDaysStr,
      specialRequests: ""
    });

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const showToast = (msg) => {

    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // --------------------------------------------------
  // FETCH USER BOOKINGS
  // --------------------------------------------------

  const fetchMyBookings = async () => {

    if (!username) {
      setMyBookings([]);
      return;
    }

    try {

      const response =
        await getReservationsByUser(
          username
        );

      const activeBookings =
        (response.data || []).filter(
          (booking) =>
            booking.status !==
            "CANCELLED"
        );

      setMyBookings(
        activeBookings
      );

    } catch (err) {

      console.error(
        "Error fetching bookings:",
        err
      );

      setMyBookings([]);
    }
  };

  // --------------------------------------------------
  // FETCH INITIAL ROOMS
  // --------------------------------------------------

  const fetchRooms = async () => {

    try {

      const response =
        await getAvailableRooms();

      setRooms(
        response.data || []
      );

    } catch (err) {

      console.error(
        "Error fetching rooms:",
        err
      );

      setRooms([]);
    }
  };

  // --------------------------------------------------
  // FETCH EVERYTHING
  // --------------------------------------------------

  const fetchData = async () => {

    setLoading(true);

    try {

      await Promise.all([
        fetchRooms(),
        fetchMyBookings()
      ]);

    } catch (err) {

      console.error(
        "Error fetching user data:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // --------------------------------------------------
  // CHECK ROOM AVAILABILITY FOR SELECTED DATES
  // --------------------------------------------------

  const checkDateAvailability = async (
    checkInDate,
    checkOutDate
  ) => {

    if (
      !checkInDate ||
      !checkOutDate
    ) {
      return;
    }

    if (
      checkOutDate <= checkInDate
    ) {

      setRooms([]);

      return;
    }

    setCheckingAvailability(true);

    try {

      const response =
        await getAvailableRoomsForDates(
          checkInDate,
          checkOutDate
        );

      const availableRooms =
        response.data || [];

      setRooms(
        availableRooms
      );

      /*
       * If currently selected room
       * is no longer available for
       * the new dates, close modal.
       */

      if (
        bookingRoom &&
        !availableRooms.some(
          (room) =>
            room.roomNumber ===
            bookingRoom.roomNumber
        )
      ) {

        setBookingRoom(null);

        showToast(
          "The selected room is not available for these dates."
        );
      }

    } catch (err) {

      console.error(
        "Availability check failed:",
        err
      );

      setRooms([]);

      showToast(
        err.response?.data?.message ||
        "Unable to check room availability."
      );

    } finally {

      setCheckingAvailability(
        false
      );
    }
  };

  // --------------------------------------------------
  // PRICE CALCULATION
  // --------------------------------------------------

  const calculatePrice = (
    room,
    checkIn,
    checkOut
  ) => {

    if (
      !room ||
      !checkIn ||
      !checkOut
    ) {
      return 0;
    }

    const start =
      new Date(checkIn);

    const end =
      new Date(checkOut);

    const diffTime =
      Math.max(
        0,
        end - start
      );

    const days =
      Math.ceil(
        diffTime /
          (1000 *
            60 *
            60 *
            24)
      );

    return (
      (days || 1) *
      (room.pricePerNight || 150)
    );
  };

  // --------------------------------------------------
  // OPEN BOOKING MODAL
  // --------------------------------------------------

  const handleOpenBookingModal = (
    room
  ) => {

    setBookingRoom(room);

    setBookingForm({
      guestName: guestName,

      guestEmail:
        user?.email ||
        "guest@example.com",

      contactNumber:
        "9876543210",

      checkInDate:
        todayStr,

      checkOutDate:
        threeDaysStr,

      specialRequests: ""
    });
  };

  // --------------------------------------------------
  // CHANGE BOOKING DATES
  // --------------------------------------------------

  const handleBookingDateChange = async (
    field,
    value
  ) => {

    const updatedForm = {
      ...bookingForm,
      [field]: value
    };

    setBookingForm(
      updatedForm
    );

    /*
     * Check availability immediately
     * when both dates are valid.
     */

    if (
      updatedForm.checkInDate &&
      updatedForm.checkOutDate &&
      updatedForm.checkOutDate >
        updatedForm.checkInDate
    ) {

      await checkDateAvailability(
        updatedForm.checkInDate,
        updatedForm.checkOutDate
      );
    }
  };

  // --------------------------------------------------
  // CONFIRM BOOKING
  // --------------------------------------------------

  const handleConfirmBooking = async (
    e
  ) => {

    e.preventDefault();

    if (!bookingRoom) {
      return;
    }

    if (
      !bookingForm.checkInDate ||
      !bookingForm.checkOutDate
    ) {

      showToast(
        "Please select check-in and check-out dates."
      );

      return;
    }

    if (
      bookingForm.checkOutDate <=
      bookingForm.checkInDate
    ) {

      showToast(
        "Check-out date must be after check-in date."
      );

      return;
    }

    const totalPrice =
      calculatePrice(
        bookingRoom,
        bookingForm.checkInDate,
        bookingForm.checkOutDate
      );

    try {

      const payload = {

        /*
         * IMPORTANT:
         * Backend uses this to associate
         * booking with logged-in user.
         */
        ownerUsername:
          username,

        guestName:
          bookingForm.guestName,

        guestEmail:
          bookingForm.guestEmail,

        contactNumber:
          bookingForm.contactNumber,

        roomNumber:
          bookingRoom.roomNumber,

        roomType:
          bookingRoom.roomType,

        checkInDate:
          bookingForm.checkInDate,

        checkOutDate:
          bookingForm.checkOutDate,

        totalPrice:
          totalPrice,

        status:
          "CONFIRMED",

        specialRequests:
          bookingForm.specialRequests
      };

      console.log(
        "Booking payload:",
        payload
      );

      await createReservation(
        payload
      );

      showToast(
        `Reservation for ${bookingRoom.roomType} confirmed!`
      );

      setBookingRoom(null);

      setActiveTab(
        "my-bookings"
      );

      /*
       * Refresh rooms and bookings.
       * The newly booked room will disappear
       * from available rooms for the selected
       * dates.
       */
      await fetchData();

    } catch (err) {

      console.error(
        "Booking error:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      showToast(
        err.response?.data?.message ||
        "Error creating reservation."
      );

      /*
       * If another user booked the room
       * just before this request, refresh
       * availability.
       */
      await checkDateAvailability(
        bookingForm.checkInDate,
        bookingForm.checkOutDate
      );
    }
  };

  // --------------------------------------------------
  // CANCEL BOOKING
  // --------------------------------------------------

  const handleCancelBooking = async (
    id
  ) => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {

      await updateReservationStatus(
        id,
        "CANCELLED"
      );

      showToast(
        `Booking #${id} cancelled.`
      );

      /*
       * Remove immediately from UI.
       */
      setMyBookings(
        (prev) =>
          prev.filter(
            (booking) =>
              booking.reservationId !== id
          )
      );

      /*
       * Refresh rooms so that the room
       * becomes available again.
       */
      await checkDateAvailability(
        bookingForm.checkInDate,
        bookingForm.checkOutDate
      );

    } catch (err) {

      console.error(
        "Cancel booking error:",
        err
      );

      showToast(
        err.response?.data?.message ||
        "Failed to cancel booking."
      );
    }
  };

  // --------------------------------------------------
  // UPLOAD ID
  // --------------------------------------------------

  const handleUploadIdProof = async (
    e
  ) => {

    e.preventDefault();

    if (
      !selectedFile ||
      !uploadResId
    ) {
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    try {

      await uploadReservationDocument(
        uploadResId,
        formData
      );

      showToast(
        `ID proof attached for Booking #${uploadResId}!`
      );

      setUploadResId(null);
      setSelectedFile(null);

      await fetchMyBookings();

    } catch (err) {

      console.error(
        "Upload error:",
        err
      );

      showToast(
        "Failed to upload ID proof."
      );
    }
  };

  // --------------------------------------------------
  // FILTER ROOMS
  // --------------------------------------------------

  const filteredRooms =
    rooms.filter(
      (r) =>
        selectedRoomType ===
          "ALL" ||
        r.roomType
          ?.toLowerCase()
          .includes(
            selectedRoomType.toLowerCase()
          )
    );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div>

      <Navbar />

      <main className="main-content">

        {/* TOAST */}

        {toastMessage && (
          <div className="toast-alert">

            <CheckCircle
              size={18}
              color="var(--primary-gold)"
            />

            <span>
              {toastMessage}
            </span>

          </div>
        )}

        {/* WELCOME HEADER */}

        <div
          className="section-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.9))",

            border:
              "1px solid var(--border-gold)",

            marginBottom:
              "24px"
          }}
        >

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              flexWrap:
                "wrap",

              gap:
                "16px"
            }}
          >

            <div>

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "8px"
                }}
              >

                <Sparkles
                  size={20}
                  color="var(--primary-gold)"
                />

                <h1
                  style={{
                    fontSize:
                      "1.6rem",

                    fontWeight:
                      800
                  }}
                >
                  Welcome back,{" "}
                  {guestName}!
                </h1>

              </div>

              <p
                style={{
                  color:
                    "var(--text-muted)",

                  marginTop:
                    "4px",

                  fontSize:
                    "0.9rem"
                }}
              >
                Discover our hand-crafted
                luxury suites and manage
                your upcoming stays
                seamlessly.
              </p>

            </div>

            <div
              style={{
                display:
                  "flex",

                gap:
                  "12px"
              }}
            >

              <button
                className="btn btn-gold"
                onClick={() =>
                  setActiveTab(
                    "browse"
                  )
                }
              >
                <Key size={16} />
                Browse Rooms
              </button>

              <button
                className="btn btn-outline"
                onClick={() =>
                  setActiveTab(
                    "my-bookings"
                  )
                }
              >
                <Calendar size={16} />
                My Bookings (
                {myBookings.length})
              </button>

            </div>

          </div>

        </div>

        {/* TABS */}

        <div className="tabs-container">

          <button
            className={`tab-btn ${
              activeTab === "browse"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "browse"
              )
            }
          >
            Available Rooms & Suites (
            {rooms.length})
          </button>

          <button
            className={`tab-btn ${
              activeTab ===
              "my-bookings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "my-bookings"
              )
            }
          >
            My Reservations (
            {myBookings.length})
          </button>

        </div>

        {/* ==================================================
            BROWSE ROOMS
        ================================================== */}

        {activeTab === "browse" && (
          <div>

            {/* DATE SEARCH */}

            <div
              className="section-card"
              style={{
                marginBottom:
                  "20px"
              }}
            >

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "flex-end",

                  gap:
                    "16px",

                  flexWrap:
                    "wrap"
                }}
              >

                <div
                  style={{
                    flex:
                      "1 1 200px"
                  }}
                >

                  <label
                    style={{
                      fontSize:
                        "0.85rem",

                      color:
                        "var(--text-muted)"
                    }}
                  >
                    Check-In Date
                  </label>

                  <input
                    type="date"
                    min={todayStr}
                    value={
                      bookingForm.checkInDate
                    }
                    onChange={(e) =>
                      handleBookingDateChange(
                        "checkInDate",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div
                  style={{
                    flex:
                      "1 1 200px"
                  }}
                >

                  <label
                    style={{
                      fontSize:
                        "0.85rem",

                      color:
                        "var(--text-muted)"
                    }}
                  >
                    Check-Out Date
                  </label>

                  <input
                    type="date"
                    min={
                      bookingForm.checkInDate ||
                      todayStr
                    }
                    value={
                      bookingForm.checkOutDate
                    }
                    onChange={(e) =>
                      handleBookingDateChange(
                        "checkOutDate",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div
                  style={{
                    color:
                      "var(--text-muted)",

                    fontSize:
                      "0.85rem",

                    paddingBottom:
                      "10px"
                  }}
                >
                  {checkingAvailability
                    ? "Checking availability..."
                    : `${rooms.length} room(s) available`}
                </div>

              </div>

              {bookingForm.checkOutDate <=
                bookingForm.checkInDate && (
                <p
                  style={{
                    color:
                      "#ef4444",

                    fontSize:
                      "0.8rem",

                    marginTop:
                      "10px"
                  }}
                >
                  Check-out date must
                  be after check-in
                  date.
                </p>
              )}

            </div>

            {/* ROOM FILTER */}

            <div
              className="section-header"
              style={{
                marginBottom:
                  "20px"
              }}
            >

              <h2 className="section-title">
                Select Your Luxury
                Experience
              </h2>

              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "8px",

                  flexWrap:
                    "wrap"
                }}
              >

                {[
                  "ALL",
                  "Deluxe",
                  "Executive",
                  "Penthouse",
                  "Villa"
                ].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedRoomType(
                          type
                        )
                      }
                      className={`btn btn-sm ${
                        selectedRoomType ===
                        type
                          ? "btn-gold"
                          : "btn-outline"
                      }`}
                      style={{
                        fontSize:
                          "0.78rem"
                      }}
                    >
                      {type}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* ROOMS */}

            {loading ||
            checkingAvailability ? (

              <div
                style={{
                  padding:
                    "40px",

                  textAlign:
                    "center",

                  color:
                    "var(--text-muted)"
                }}
              >
                Checking room
                availability...
              </div>

            ) : filteredRooms.length ===
              0 ? (

              <div
                className="section-card"
                style={{
                  padding:
                    "40px",

                  textAlign:
                    "center",

                  color:
                    "var(--text-muted)"
                }}
              >

                <h3
                  style={{
                    marginBottom:
                      "8px"
                  }}
                >
                  No rooms available
                </h3>

                <p>
                  There are no rooms
                  available for the
                  selected dates.
                  Please try different
                  dates.
                </p>

              </div>

            ) : (

              <div className="rooms-grid">

                {filteredRooms.map(
                  (room) => (

                    <div
                      key={
                        room.roomId ||
                        room.roomNumber
                      }
                      className="room-card"
                    >

                      <img
                        src={
                          room.imageUrl
                            ? getFileUrl(
                                room.imageUrl
                              )
                            : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={
                          room.roomType
                        }
                        className="room-image"
                      />

                      <div className="room-details">

                        <div
                          style={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            marginBottom:
                              "4px"
                          }}
                        >

                          <span
                            style={{
                              fontWeight:
                                800,

                              color:
                                "var(--primary-gold)"
                            }}
                          >
                            Room #
                            {
                              room.roomNumber
                            }
                          </span>

                          <span className="badge badge-available">
                            AVAILABLE
                          </span>

                        </div>

                        <div className="room-type">
                          {
                            room.roomType
                          }
                        </div>

                        <div className="room-price">
                          $
                          {
                            room.pricePerNight
                          }{" "}
                          <span>
                            / night
                          </span>
                        </div>

                        <div className="room-desc">
                          {
                            room.description
                          }
                        </div>

                        <div className="amenities-list">

                          {(
                            room.amenities ||
                            ""
                          )
                            .split(",")
                            .map(
                              (
                                am,
                                idx
                              ) => (
                                <span
                                  key={
                                    idx
                                  }
                                  className="amenity-chip"
                                >
                                  {am.trim()}
                                </span>
                              )
                            )}

                        </div>

                        <button
                          onClick={() =>
                            handleOpenBookingModal(
                              room
                            )
                          }
                          className="btn btn-gold"
                          style={{
                            marginTop:
                              "auto",

                            width:
                              "100%"
                          }}
                        >
                          <Key size={16} />
                          Reserve Now
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </div>
        )}

        {/* ==================================================
            MY BOOKINGS
        ================================================== */}

        {activeTab ===
          "my-bookings" && (

          <div className="section-card">

            <h2
              className="section-title"
              style={{
                marginBottom:
                  "20px"
              }}
            >
              My Hotel Bookings
            </h2>

            {myBookings.length ===
            0 ? (

              <div
                style={{
                  padding:
                    "40px",

                  textAlign:
                    "center"
                }}
              >

                <p
                  style={{
                    color:
                      "var(--text-muted)",

                    marginBottom:
                      "16px"
                  }}
                >
                  You have no active
                  bookings at the
                  moment.
                </p>

                <button
                  className="btn btn-gold"
                  onClick={() =>
                    setActiveTab(
                      "browse"
                    )
                  }
                >
                  Browse & Reserve A
                  Room
                </button>

              </div>

            ) : (

              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(320px, 1fr))",

                  gap:
                    "20px"
                }}
              >

                {myBookings.map(
                  (b) => (

                    <div
                      key={
                        b.reservationId
                      }
                      style={{
                        background:
                          "rgba(15,23,42,0.6)",

                        border:
                          "1px solid var(--border-color)",

                        borderRadius:
                          "12px",

                        padding:
                          "20px"
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          marginBottom:
                            "12px"
                        }}
                      >

                        <span
                          style={{
                            fontWeight:
                              800,

                            color:
                              "var(--primary-gold)"
                          }}
                        >
                          Booking #
                          {
                            b.reservationId
                          }
                        </span>

                        <span
                          className={`badge badge-${b.status?.toLowerCase()}`}
                        >
                          {b.status}
                        </span>

                      </div>

                      <div
                        style={{
                          fontSize:
                            "1.1rem",

                          fontWeight:
                            700,

                          marginBottom:
                            "4px"
                        }}
                      >
                        {
                          b.roomType ||
                          `Room ${b.roomNumber}`
                        }
                      </div>

                      <div
                        style={{
                          fontSize:
                            "0.85rem",

                          color:
                            "var(--text-muted)",

                          marginBottom:
                            "14px"
                        }}
                      >
                        Room #
                        {
                          b.roomNumber
                        }
                      </div>

                      <div
                        style={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            "1fr 1fr",

                          gap:
                            "8px",

                          fontSize:
                            "0.82rem",

                          background:
                            "rgba(0,0,0,0.2)",

                          padding:
                            "10px",

                          borderRadius:
                            "8px",

                          marginBottom:
                            "14px"
                        }}
                      >

                        <div>
                          <span
                            style={{
                              color:
                                "var(--text-muted)",

                              display:
                                "block"
                            }}
                          >
                            Check In
                          </span>

                          <strong>
                            {
                              b.checkInDate ||
                              "N/A"
                            }
                          </strong>
                        </div>

                        <div>
                          <span
                            style={{
                              color:
                                "var(--text-muted)",

                              display:
                                "block"
                            }}
                          >
                            Check Out
                          </span>

                          <strong>
                            {
                              b.checkOutDate ||
                              "N/A"
                            }
                          </strong>
                        </div>

                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          marginBottom:
                            "16px"
                        }}
                      >

                        <span
                          style={{
                            fontSize:
                              "0.85rem",

                            color:
                              "var(--text-muted)"
                          }}
                        >
                          Total Paid
                        </span>

                        <span
                          style={{
                            fontSize:
                              "1.3rem",

                            fontWeight:
                              800
                          }}
                        >
                          $
                          {
                            b.totalPrice ||
                            0
                          }
                        </span>

                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          flexDirection:
                            "column",

                          gap:
                            "8px"
                        }}
                      >

                        {b.documentUrl ? (

                          <a
                            href={getFileUrl(
                              b.documentUrl
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline btn-sm"
                          >
                            <FileText
                              size={14}
                            />
                            View Attached
                            ID Proof
                          </a>

                        ) : (

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              setUploadResId(
                                b.reservationId
                              )
                            }
                          >
                            <Upload
                              size={14}
                            />
                            Upload ID Proof
                          </button>

                        )}

                        <div
                          style={{
                            display:
                              "flex",

                            gap:
                              "8px"
                          }}
                        >

                          <button
                            className="btn btn-gold btn-sm"
                            style={{
                              flex:
                                1
                            }}
                            onClick={() =>
                              setReceiptBooking(
                                b
                              )
                            }
                          >
                            <FileText
                              size={14}
                            />
                            View Invoice
                          </button>

                          {b.status !==
                            "CANCELLED" && (

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleCancelBooking(
                                  b.reservationId
                                )
                              }
                            >
                              <XCircle
                                size={14}
                              />
                              Cancel
                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        )}

        {/* ==================================================
            BOOKING MODAL
        ================================================== */}

        {bookingRoom && (
          <div className="modal-overlay">

            <div className="modal-content">

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  marginBottom:
                    "20px"
                }}
              >

                <div>

                  <h3
                    style={{
                      fontSize:
                        "1.2rem",

                      fontWeight:
                        700
                    }}
                  >
                    Reserve{" "}
                    {
                      bookingRoom.roomType
                    }
                  </h3>

                  <div
                    style={{
                      fontSize:
                        "0.85rem",

                      color:
                        "var(--primary-gold)"
                    }}
                  >
                    Room #
                    {
                      bookingRoom.roomNumber
                    }{" "}
                    • $
                    {
                      bookingRoom.pricePerNight
                    }
                    /night
                  </div>

                </div>

                <button
                  onClick={() =>
                    setBookingRoom(
                      null
                    )
                  }
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} />
                </button>

              </div>

              <form
                onSubmit={
                  handleConfirmBooking
                }
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    "14px"
                }}
              >

                <div>

                  <label>
                    Guest Name
                  </label>

                  <input
                    required
                    value={
                      bookingForm.guestName
                    }
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,

                        guestName:
                          e.target.value
                      })
                    }
                  />

                </div>

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gap:
                      "12px"
                  }}
                >

                  <div>

                    <label>
                      Contact Number *
                    </label>

                    <input
                      required
                      value={
                        bookingForm.contactNumber
                      }
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,

                          contactNumber:
                            e.target.value
                        })
                      }
                    />

                  </div>

                  <div>

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={
                        bookingForm.guestEmail
                      }
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,

                          guestEmail:
                            e.target.value
                        })
                      }
                    />

                  </div>

                </div>

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gap:
                      "12px"
                  }}
                >

                  <div>

                    <label>
                      Check-In Date *
                    </label>

                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={
                        bookingForm.checkInDate
                      }
                      onChange={(e) =>
                        handleBookingDateChange(
                          "checkInDate",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div>

                    <label>
                      Check-Out Date *
                    </label>

                    <input
                      type="date"
                      required
                      min={
                        bookingForm.checkInDate ||
                        todayStr
                      }
                      value={
                        bookingForm.checkOutDate
                      }
                      onChange={(e) =>
                        handleBookingDateChange(
                          "checkOutDate",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div>

                  <label>
                    Special Requests
                  </label>

                  <textarea
                    rows={2}
                    placeholder="e.g. Airport shuttle, early check-in, high floor"
                    value={
                      bookingForm.specialRequests
                    }
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,

                        specialRequests:
                          e.target.value
                      })
                    }
                  />

                </div>

                <div
                  style={{
                    background:
                      "rgba(245, 158, 11, 0.1)",

                    border:
                      "1px solid var(--border-gold)",

                    padding:
                      "16px",

                    borderRadius:
                      "10px"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between"
                    }}
                  >

                    <span>
                      Total Amount:
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "1.4rem",

                        color:
                          "var(--primary-gold)"
                      }}
                    >
                      $
                      {
                        calculatePrice(
                          bookingRoom,
                          bookingForm.checkInDate,
                          bookingForm.checkOutDate
                        )
                      }
                    </strong>

                  </div>

                </div>

                <button
                  type="submit"
                  className="btn btn-gold"
                >
                  Confirm Booking Now
                </button>

              </form>

            </div>

          </div>
        )}

        {/* ==================================================
            UPLOAD ID MODAL
        ================================================== */}

        {uploadResId && (
          <div className="modal-overlay">

            <div
              className="modal-content"
              style={{
                maxWidth:
                  "450px"
              }}
            >

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  marginBottom:
                    "16px"
                }}
              >

                <h3>
                  Upload ID Document
                </h3>

                <button
                  onClick={() => {
                    setUploadResId(
                      null
                    );
                    setSelectedFile(
                      null
                    );
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} />
                </button>

              </div>

              <form
                onSubmit={
                  handleUploadIdProof
                }
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    "16px"
                }}
              >

                <p
                  style={{
                    fontSize:
                      "0.85rem",

                    color:
                      "var(--text-muted)"
                  }}
                >
                  Upload a clear image
                  or PDF of your
                  Passport / Government
                  ID for Booking #
                  {uploadResId}.
                </p>

                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files[0]
                    )
                  }
                  style={{
                    padding:
                      "8px"
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-gold"
                >
                  <Upload size={16} />
                  Submit ID Proof
                </button>

              </form>

            </div>

          </div>
        )}

        {/* ==================================================
            INVOICE MODAL
        ================================================== */}

        {receiptBooking && (
          <div className="modal-overlay">

            <div
              className="modal-content"
              style={{
                maxWidth:
                  "500px",

                border:
                  "1px solid var(--border-gold)"
              }}
            >

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  marginBottom:
                    "20px"
                }}
              >

                <h3
                  style={{
                    color:
                      "var(--primary-gold)"
                  }}
                >
                  GRAND HORIZON
                  INVOICE
                </h3>

                <button
                  onClick={() =>
                    setReceiptBooking(
                      null
                    )
                  }
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} />
                </button>

              </div>

              <div
                style={{
                  background:
                    "#0f172a",

                  padding:
                    "20px",

                  borderRadius:
                    "10px"
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    borderBottom:
                      "1px solid var(--border-color)",

                    paddingBottom:
                      "12px",

                    marginBottom:
                      "12px"
                  }}
                >

                  <div>

                    <span>
                      RESERVATION NO.
                    </span>

                    <div
                      style={{
                        fontWeight:
                          800
                      }}
                    >
                      #
                      {
                        receiptBooking.reservationId
                      }
                    </div>

                  </div>

                  <div
                    style={{
                      textAlign:
                        "right"
                    }}
                  >

                    <span>
                      STATUS
                    </span>

                    <div>
                      <span
                        className={`badge badge-${receiptBooking.status?.toLowerCase()}`}
                      >
                        {
                          receiptBooking.status
                        }
                      </span>
                    </div>

                  </div>

                </div>

                <div
                  style={{
                    marginBottom:
                      "12px"
                  }}
                >

                  <span>
                    GUEST NAME
                  </span>

                  <div
                    style={{
                      fontWeight:
                        700
                    }}
                  >
                    {
                      receiptBooking.guestName
                    }
                  </div>

                  <div>
                    {
                      receiptBooking.contactNumber
                    }
                  </div>

                </div>

                <div
                  style={{
                    marginBottom:
                      "12px"
                  }}
                >

                  <span>
                    ACCOMMODATION
                  </span>

                  <div
                    style={{
                      fontWeight:
                        700
                    }}
                  >
                    {
                      receiptBooking.roomType ||
                      `Room ${receiptBooking.roomNumber}`
                    }
                  </div>

                  <div>
                    Room #
                    {
                      receiptBooking.roomNumber
                    }
                  </div>

                </div>

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gap:
                      "10px",

                    borderBottom:
                      "1px solid var(--border-color)",

                    paddingBottom:
                      "12px",

                    marginBottom:
                      "12px"
                  }}
                >

                  <div>

                    <span>
                      CHECK-IN
                    </span>

                    <div
                      style={{
                        fontWeight:
                          700
                      }}
                    >
                      {
                        receiptBooking.checkInDate ||
                        "N/A"
                      }
                    </div>

                  </div>

                  <div>

                    <span>
                      CHECK-OUT
                    </span>

                    <div
                      style={{
                        fontWeight:
                          700
                      }}
                    >
                      {
                        receiptBooking.checkOutDate ||
                        "N/A"
                      }
                    </div>

                  </div>

                </div>

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between"
                  }}
                >

                  <span>
                    TOTAL AMOUNT PAID
                  </span>

                  <span
                    style={{
                      fontSize:
                        "1.4rem",

                      fontWeight:
                        800,

                      color:
                        "var(--primary-gold)"
                    }}
                  >
                    $
                    {
                      receiptBooking.totalPrice ||
                      0
                    }
                  </span>

                </div>

              </div>

              <button
                className="btn btn-gold"
                style={{
                  width:
                    "100%",

                  marginTop:
                    "16px"
                }}
                onClick={() =>
                  window.print()
                }
              >
                Print Invoice
              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default UserDashboard;

