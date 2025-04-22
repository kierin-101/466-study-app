import React from "react";

const Dashboard = () => {
  const dashContent = (
    <div className="dashboard">
      <h1>Welcome to the Study App!</h1>
      <p>For students:</p>
      <ul>
        <li>Take quizzes to test your knowledge.</li>
        <li>Track your progress and performance.</li>
        <li>Earn rewards for completing tasks.</li>
        <li>Customize your profile with avatars, titles, and themes.</li>
      </ul>
      <p>For teachers:</p>
      <ul>
        <li>Create quizzes and assignments for your students.</li>
        <li>Monitor student progress and performance.</li>
        <li>Provide feedback and support to your students.</li>
        <li>Manage rewards and incentives for student engagement.</li>
      </ul>
    </div>
  );

  return (
    <>
      {dashContent}
    </>
  );
}
export default Dashboard;