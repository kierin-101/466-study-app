import React from "react";

const Dashboard = () => {
  const dashContent = (
    <div className="dashboard">
      <div className="number-list">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="number-item">
            {i + 1}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {dashContent}
    </>
  );
}
export default Dashboard;