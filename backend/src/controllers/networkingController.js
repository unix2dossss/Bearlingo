import linkedinprofile from "../models/LinkedInProfile.js";

export const addLinkedInProfile = async (req, res) => {
    const userId = req.user._id;
    try {
        console.log("Incoming request body:", req.body);
        console.log("Authenticated user:", req.user);
        const { firstName, lastName, professionalHeadline, currentRole, keySkills, objective } = req.body;

        const linkedInProfile = new linkedinprofile({
            user: userId,
            firstName,
            lastName,
            professionalHeadline,
            currentRole,
            keySkills,
            objective
        });
        await linkedInProfile.save();
        res.status(201).json({
            message: "Linked In Profile Created Succesfully!",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};


export const updateLinkedInProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, professionalHeadline, currentRole, keySkills, objective } = req.body;
        const linkedInProfile = await linkedinprofile.findOne({ user: userID });

        if (!linkedInProfile) {
            return res.status(404).json({ message: "LinkedIn Profile not found" });
        }

        linkedInProfile.firstName = firstName ?? linkedInProfile.firstName; //If req.body.firstName is undefined, it keep old value. If it’s an empty string then it updates it to empty string
        linkedInProfile.lastName = lastName ?? linkedInProfile.lastName;
        linkedInProfile.professionalHeadline = professionalHeadline ?? linkedInProfile.professionalHeadline;
        linkedInProfile.currentRole = currentRole ?? linkedInProfile.currentRole;
        linkedInProfile.keySkills = keySkills ?? linkedInProfile.keySkills;
        linkedInProfile.objective = objective ?? linkedInProfile.objective;

        await linkedInProfile.save();
        return res.status(201).json({ message: "Linked In Profile Updated Succesfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};