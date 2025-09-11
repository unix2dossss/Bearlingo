import React from 'react';

const LeaderboardCard = ({ user, index, goldMedal, silverMedal, bronzeMedal, linkedInIcon, starIcon }) => {
  const renderPosition = () => {
    if (index === 0) return <img height="35" width="35" src={goldMedal} alt="Gold medal" />;
    if (index === 1) return <img height="35" width="35" src={silverMedal} alt="Silver medal" />;
    if (index === 2) return <img height="35" width="35" src={bronzeMedal} alt="Bronze medal" />;
    return <div className="text-4xl font-thin opacity-30 tabular-nums ml-3">{index + 1}</div>;
  };

  return (
    <li className="list-row flex items-center p-2 border-b h-[100px]">
      <div className="w-[100px] text-4xl font-thin opacity-100 tabular-nums ml-3">{renderPosition()}</div>

      {/* Profile Image */}
      <div className="w-[100px]">
        <img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" alt="Profile" />
      </div>

      {/* Username */}
      <div className="w-[250px] flex justify-center">{user.username}</div>

      {/* LinkedIn */}
      <div className="w-[190px]">
        <button className="btn btn-square btn-ghost">
          <img height="35" width="35" src={linkedInIcon} alt="LinkedIn Icon" />
        </button>
      </div>

      {/* XP */}
      <div className="flex gap-2 justify-center align-center">
        <img height="35" width="35" src={starIcon} alt="Star Icon" />
        <div className="flex justify-center align-center">{user.xp}</div>
      </div>
    </li>
  );
};

export default LeaderboardCard;



