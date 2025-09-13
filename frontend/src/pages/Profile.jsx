import React from 'react'

const Profile = () => {
    return (
        <div>
            {/* For TSX uncomment the commented types below */}
            <div
                className="radial-progress bg-primary text-primary-content border-primary border-4"
                style={{ "--value": 70 } /* as React.CSSProperties */} aria-valuenow={70} role="progressbar">
                70%
            </div>

        </div>
    )
}

export default Profile;
