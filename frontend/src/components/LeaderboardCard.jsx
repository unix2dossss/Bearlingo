import React from 'react';

const LeaderboardCard = ({ user, index, goldMedal, silverMedal, bronzeMedal, linkedInIcon, starIcon }) => {
  const renderPosition = () => {
    if (index === 0) return <img height="35" width="35" src={goldMedal} alt="Gold medal" />;
    if (index === 1) return <img height="35" width="35" src={silverMedal} alt="Silver medal" />;
    if (index === 2) return <img height="35" width="35" src={bronzeMedal} alt="Bronze medal" />;
    return <div className="text-4xl font-thin opacity-30 tabular-nums ml-3">{index + 1}</div>;
  };

  return (
    // <li className={`flex items-center justify-between p-4 rounded-xl ${index === 0 ? "bg-yellow-100" : index === 1 ? "bg-gray-100" : index === 2 ? "bg-orange-100" : "bg-white"} shadow-md`}>
    <li className={`flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-md border-2 border-gray-380`}>
      {/* Position / Medal */}
      <div className="flex items-center w-[100px] justify-center">
        {index === 0 && <img height="35" width="35" src={goldMedal} alt="Gold medal" />}
        {index === 1 && <img height="35" width="35" src={silverMedal} alt="Silver medal" />}
        {index === 2 && <img height="35" width="35" src={bronzeMedal} alt="Bronze medal" />}
        {![0,1,2].includes(index) && <span className="font-bold text-lg">{index+1}</span>}
      </div>

      {/* Profile Image */}
      <div className="w-[80px]">
        <img className="rounded-full w-12 h-12" src={user.profileImage || "https://img.daisyui.com/images/profile/demo/4@94.webp"} alt="Profile" />
      </div>

      {/* Username */}
      <div className="flex-1 text-center font-semibold">{user.username}</div>

      {/* LinkedIn Icon */}
      <div>
        <button className="btn btn-ghost btn-square">
          <img height="35" width="35" src={linkedInIcon} alt="LinkedIn Icon" />
        </button>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1">
        <img height="30" width="30" src={starIcon} alt="Star Icon" />
        <span className="font-bold">{user.xp}</span>
      </div>
    </li>
  );
};

export default LeaderboardCard;



