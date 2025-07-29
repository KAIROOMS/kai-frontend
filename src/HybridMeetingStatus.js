import React, { useState, useEffect } from 'react';
import './HybridMeetingStatus.css';
import { useLocation } from 'react-router-dom';

const HybridMeetingStatus = () => {
  const location = useLocation();
  const bookingData = location.state || {};

  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusText, setStatusText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  const offlineCount = Number(bookingData.pesertaOffline) || 0;
  const onlineCount = Number(bookingData.pesertaOnline) || 0;
  const maxOffline = Number(bookingData.maxOffline) || 12;
  const maxOnline = Number(bookingData.maxOnline) || 8;

  const totalCount = offlineCount + onlineCount;
  const maxTotal = maxOffline + maxOnline;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bookingData.waktuMulai && bookingData.waktuSelesai) {
      const now = new Date();

      const [startHour, startMinute] = bookingData.waktuMulai.split(':');
      const [endHour, endMinute] = bookingData.waktuSelesai.split(':');

      const startTime = new Date();
      startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endTime = new Date();
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const total = (endTime - startTime) / (1000 * 60);

      let diff = 0;
      let progress = 0;

      if (now < startTime) {
        diff = Math.ceil((startTime - now) / (1000 * 60));
        progress = 0;
        setStatusText(`Meeting will start in ${diff} min`);
      } else if (now >= startTime && now < endTime) {
        diff = Math.ceil((endTime - now) / (1000 * 60));
        progress = ((now - startTime) / (endTime - startTime)) * 100;
        setStatusText('Meeting in progress');
      } else {
        diff = 0;
        progress = 100;
        setStatusText('Meeting has ended');
      }

      setTimeRemaining(diff * 60);
      setProgressPercentage(progress);
    }
  }, [bookingData, currentTime]);

  const formatTime = (num) => num.toString().padStart(2, '0');

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/booking`);
        const data = await response.json();

        const today = new Date().toISOString().split('T')[0];
        const now = new Date();

        const upcoming = data.filter(item => {
          const isToday = item.tanggal === today;
          const [startHour, startMinute] = item.waktuMulai.split(':');
          const startDate = new Date();
          startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
          return isToday && startDate > now;
        });

        const sorted = upcoming.sort((a, b) => {
          const [ah, am] = a.waktuMulai.split(':');
          const [bh, bm] = b.waktuMulai.split(':');
          return new Date(0, 0, 0, ah, am) - new Date(0, 0, 0, bh, bm);
        });

        setUpcomingMeetings(sorted);
      } catch (error) {
        console.error('Error fetching upcoming meetings:', error);
      }
    };

    fetchUpcomingMeetings();
  }, []);

  return (
    <div className="body">
      <button className="backButtonHybrid" onClick={() => window.history.back()}>
        ←
      </button>
      <div className="mainContent">
        <div className="connectionIndicator">
          <div className="connectionDot"></div>
          <span>Online Connected</span>
        </div>

        <div className="statusHeader-hybrid">UNAVAILABLE</div>
        <div className="roomStatus-hybrid">ROOM IS BUSY</div>

        <div className="timerContainer-hybrid">
          <div className="circular-progress">
            <svg className="progress-ring" width="200" height="200">
              <circle className="progress-ring-circle-bg" cx="100" cy="100" r="85" />
              <circle
                className="progress-ring-circle"
                cx="100"
                cy="100"
                r="85"
                style={{
                  strokeDasharray: `${2 * Math.PI * 85}`,
                  strokeDashoffset: `${2 * Math.PI * 85 * (1 - progressPercentage / 100)}`
                }}
              />
            </svg>
            <div className="timerText">
              {formatTime(Math.floor(timeRemaining / 60))}:{formatTime(timeRemaining % 60)}
            </div>
            <div className="meeting-status-label">{statusText}</div>
          </div>
        </div>

        <div className="meetingInfo-hybrid">
          <div className="meetingTitle-hybrid">
            DAOP 1, {bookingData.ruangan}
          </div>

          <div className="meetingType-hybrid">
            <div className="hybridIcon">🔗</div>
            <span>HYBRID MEETING</span>
          </div>

          <div className="participantsInfo">
            <div className="participantGroup">
              <div className="participantIcon">👥</div>
              {offlineCount > 0 && <div className="participantCount">{offlineCount}</div>}
              <div className="participantLabel">Peserta Offline</div>
            </div>
            <div className="participantGroup">
              {bookingData.linkMeet ? (
                <div
                  className="participantIcon"
                  onClick={() => window.open(bookingData.linkMeet, "_blank")}
                  style={{ cursor: "pointer" }}
                >
                  💻
                </div>
              ) : (
                <div className="participantIcon">💻</div>
              )}
              {onlineCount > 0 && <div className="participantCount">{onlineCount}</div>}
              <div className="participantLabel">Peserta Online</div>
            </div>
          </div>

          <div className="meetingDetails-hybrid">Total: {bookingData.kapasitas} people</div>
          <div className="meetingDetails">
            {bookingData.namaRapat}
          </div>

          <div className="bookingTime">
            BOOKED {bookingData.waktuMulai || '08:40'} - {bookingData.waktuSelesai || '09:00'}
          </div>

          <div className="organizer">Organizer: {bookingData.penyelenggara || 'Unit Operasi'}</div>
        </div>
      </div>

      <div className="sidebar-hybrid">
        {upcomingMeetings.length > 0 ? (
          upcomingMeetings.map((meeting, index) => (
            <div key={index} className="scheduleItem">
              <div className="scheduleTime">{meeting.waktuMulai}-{meeting.waktuSelesai}</div>
              <div className="scheduleTitle">{meeting.namaRapat}</div>
              <div className="scheduleDetails">
                {meeting.penyelenggara}<br />
                Unit {meeting.unit || 'Tidak diketahui'}
              </div>
            </div>
          ))
        ) : (
          <div className="scheduleItem">
            <div className="scheduleTitle">Tidak ada meeting selanjutnya hari ini.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HybridMeetingStatus;
