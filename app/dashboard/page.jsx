"use client";

import { useEffect, useState } from "react";
import { useOCAuth } from "@opencampus/ocid-connect-js";
import Layout from "../../components/Layout";

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
      console.log("🔍 Fetching Achievements for OCID:", ocId); // Debugging log
  
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocId }),
      });
  
      if (!res.ok) {
        const errorData = await res.json(); // Try to read the error response
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || "Unknown error"}`);
      }
  
      const data = await res.json();
      console.log("✅ Achievements fetched:", data); // Debugging log
  
      setAchievements(data.achievements || []);
      setHasClaimed(
        data.achievements?.some((achievement) => achievement.name === "IEMusic Workshop") &&
        data.achievements?.some((achievement) => achievement.name === "Live Zoom Call with Star Musician")
      );
    } catch (error) {
      console.error("❌ Error fetching achievements:", error.message);
    }
  };
  
  
  const handleClaimBadge = async (badgeName) => {
    if (!authState?.OCId) {
      setMessage("❌ Error: No OCID found for user.");
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
        setMessage(`🎉 ${badgeName} Badge Issued Successfully!`);
  
        // ✅ Fetch updated achievements immediately after claiming
        setTimeout(async () => {
          await fetchUserAchievements(authState.OCId);
          setClaiming(false);
        }, 2000); // ✅ Add a slight delay for database sync if needed
      } else {
        setMessage("❌ Error Issuing Badge: " + data.message);
        setClaiming(false);
      }
    } catch (error) {
      console.error("❌ Error claiming badge:", error.message);
      setMessage("❌ Failed to claim badge. Try again later.");
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
        {authState ? (
          <>
            <p>You are logged in as: <strong>{authState.OCId || "No ID available"}</strong></p>
            <p>Wallet Address: <strong>{authState.ethAddress || "No wallet address available"}</strong></p>
          </>
        ) : (
          <p>Loading authentication...</p>
        )}
      </div>
      <div className="col-container">
        <div className="column">
        <h2>Claim Your Badges</h2>
          {!loading && !claiming && (
            <>
              {/* IEMusic Workshop Badge */}
              {!achievements.some((ach) => ach.name === "IEMusic Workshop") && (
                <div className="claim-card">
                  <div className="claim-left">
                    <button onClick={() => handleClaimBadge("IEMusic Workshop")} className="claim-button">
                      Claim Badge
                    </button>
                  </div>

                  <div className="claim-middle">
                    <h3>IEMusic Workshop Achievement</h3>
                    <p>Earn this exclusive award for completing the IEMusic Workshop!</p>
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
              {!achievements.some((ach) => ach.name === "Live Zoom Call with Star Musician") && (
                <div className="claim-card">
                  <div className="claim-left">
                    <button onClick={() => handleClaimBadge("Live Zoom Call with Star Musician")} className="claim-button">
                      Claim Badge
                    </button>
                  </div>

                  <div className="claim-middle">
                    <h3>Live Zoom Call with Star Musician</h3>
                    <p>Exclusive access to a live session with a star musician!</p>
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
              <p>Claiming your achievement... Please wait.</p>
            </div>
          )}

          {/* ✅ Show message only when ALL badges have been claimed */}
          {!loading &&
            achievements.some((ach) => ach.name === "IEMusic Workshop") &&
            achievements.some((ach) => ach.name === "Live Zoom Call with Star Musician") && (
              <p className="no-badges-message">🎉 No more badges to claim right now!</p>
            )}
        </div>



        
        <div className="column">            
        <h2>Your Achievements</h2>
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
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                    <p className="badge-date">
                      🎉 Issued: {new Date(achievement.issuedAt).toLocaleDateString()}
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

