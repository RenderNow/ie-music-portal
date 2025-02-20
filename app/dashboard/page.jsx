"use client";

import { useEffect, useState } from "react";
import { useOCAuth } from "@opencampus/ocid-connect-js";
import Layout from "../../components/Layout";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { authState, ocAuth } = useOCAuth();
  const [message, setMessage] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [user, setUser] = useState(null);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !authState?.idToken) return;

    setLoading(true);

    try {
      const userData = {
        ocId: authState.OCId,
        name: authState?.user?.name || "No Name",
        email: authState?.user?.email || "No Email",
        ethAddress: authState.ethAddress || "No Wallet Address",
      };

      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setAchievements(data.achievements || []);
          setHasClaimed(
            data.achievements?.some((achievement) => achievement.name === "IEMusic Workshop")
          );
        })
        .catch((error) => console.error("❌ API Fetch Error:", error))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("❌ Error in user fetch:", error);
      setLoading(false);
    }
  }, [authState, isClient]);

  const fetchUserAchievements = async (ocId) => {
    try {
      console.log("🔍 Fetching Achievements for OCID:", ocId);

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${errorData.error || "Unknown error"}`
        );
      }

      const data = await res.json();
      console.log("✅ Achievements fetched:", data);

      setAchievements(data.achievements || []);
      setHasClaimed(
        data.achievements?.some((achievement) => achievement.name === "IEMusic Workshop") &&
          data.achievements?.some(
            (achievement) => achievement.name === "Live Zoom Call with Star Musician"
          )
      );
    } catch (error) {
      console.error("❌ Error fetching achievements:", error.message);
    }
  };

  const handleClaimBadge = async (badgeName) => {
    if (!authState?.OCId) {
      setMessage("❌ Error: No OCID found for user.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setClaiming(true);

    const badgeData = {
      holderOcId: authState.OCId,
      name: badgeName,
      description:
        badgeName === "IEMusic Workshop"
          ? "Awarded for completing IEMusic Workshop"
          : "Exclusive access to a live session with a star musician",
      image:
        badgeName === "IEMusic Workshop"
          ? "https://ie-music.co.uk/wp-content/uploads/2022/02/1.png"
          : "https://ie-music.co.uk/wp-content/uploads/2022/02/1.png",
    };

    try {
      const response = await fetch("/api/issue-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(badgeData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`🎉 Well done! You have won an award: ${badgeName}!`);
        // Fire confetti explosion effect
        confetti({
          particleCount: 500,
          spread: 300,
          origin: { y: 0.8 },
        });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 4000);

        // Fetch updated achievements after a short delay
        setTimeout(async () => {
          await fetchUserAchievements(authState.OCId);
          setClaiming(false);
        }, 2000);
      } else {
        setMessage("❌ Error Issuing Badge: " + data.message);
        setTimeout(() => setMessage(""), 3000);
        setClaiming(false);
      }
    } catch (error) {
      console.error("❌ Error claiming badge:", error.message);
      setMessage("❌ Failed to claim badge. Try again later.");
      setTimeout(() => setMessage(""), 3000);
      setClaiming(false);
    }
  };

  const handleLogout = async () => {
    try {
      await ocAuth.logout();
      document.cookie = "ocid_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      sessionStorage.clear();
      window.open("https://auth.staging.opencampus.xyz/login?new_session=true", "_blank");
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  if (!isClient) return null;

  return (
    <Layout>
      <div>
        <h1>Welcome to the Dashboard</h1>
        <h3>"Claim and earn your badges right from your dashboard!"</h3>
        {message && <div className="message-box">{message}</div>}
      </div>
      <div className="col-container">
        <div className="column1">
          <h2>Claim Your Badges</h2>
          {!loading && !claiming && (
            <>
              {/* IEMusic Workshop Badge */}
              {!achievements.some(
                (ach) => ach.name === "IEMusic Workshop"
              ) && (
                <div
                  className="claim-card"
                  onClick={() =>
                    handleClaimBadge("IEMusic Workshop")
                  }
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleClaimBadge("IEMusic Workshop");
                    }
                  }}
                >
                  <div className="claim-middle">
                    <h4>IEMusic Workshop Achievement</h4>
                    <p>
                    Earn this exclusive award for completing the IEMusic Workshop!
                    </p>
                  </div>
                  <div className="claim-right">
                    <img
                      src="https://ie-music.co.uk/wp-content/uploads/2022/02/1.png"
                      alt="IEMusic Workshop Badge"
                      className="claim-image"
                    />
                  </div>
                </div>
              )}
              {/* Live Zoom Call Badge */}
              {!achievements.some(
                (ach) => ach.name === "Live Zoom Call with Star Musician"
              ) && (
                <div
                  className="claim-card"
                  onClick={() =>
                    handleClaimBadge("Live Zoom Call with Star Musician")
                  }
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleClaimBadge("Live Zoom Call with Star Musician");
                    }
                  }}
                >
                  <div className="claim-middle">
                    <h4>Live Zoom Call with Star Musician</h4>
                    <p>
                      Exclusive access to a live session with a star musician!
                    </p>
                  </div>
                  <div className="claim-right">
                    <img
                      src="https://ie-music.co.uk/wp-content/uploads/2022/02/1.png"
                      alt="Live Zoom Call Badge"
                      className="claim-image"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {claiming && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Claiming your badge... Please wait.</p>
            </div>
          )}

          {!loading &&
            achievements.some((ach) => ach.name === "IEMusic Workshop") &&
            achievements.some(
              (ach) => ach.name === "Live Zoom Call with Star Musician"
            ) && (
              <p className="no-badges-message">
                🎉 No more badges to claim right now!
              </p>
            )}
        </div>

        <div className="column2">
          <h2>Your Badges</h2>
          <div className="achievements-container">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div key={index} className="badge-card">
                  <div className="badge-left">
                    <img
                      src={achievement.image || "https://via.placeholder.com/100"}
                      alt={achievement.name}
                      className="badge-image"
                    />
                  </div>
                  <div className="badge-middle">
                    <h5>{achievement.name}</h5>
                    <h6>{achievement.description}</h6>
                    <p className="badge-date">
                      🎉 Issued:{" "}
                      {new Date(achievement.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No achievements assigned yet.</p>
            )}
            {achievements.length > 0 && (
              <div className="profile-button-container">
                <a
                  href={`https://id.sandbox.opencampus.xyz/public/credentials?username=${authState.OCId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-button"
                >
                  🎓 View Your OCID Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
