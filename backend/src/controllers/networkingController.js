import linkedinprofile from "../models/LinkedInProfile.js";
import events from "../models/AttendedEvent.js";

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
        const linkedInProfile = await linkedinprofile.findOne({ user: userId });

        if (!linkedInProfile) {
            return res.status(404).json({ message: "LinkedIn Profile not found" });
        }

        linkedInProfile.firstName = firstName ?? linkedInProfile.firstName; //If req.body.firstName is undefined, it keep old value. If it’s an empty string then it updates it to empty string
        linkedInProfile.lastName = lastName ?? linkedInProfile.lastName;
        linkedInProfile.professionalHeadline = professionalHeadline ?? linkedInProfile.professionalHeadline;
        linkedInProfile.currentRole = currentRole ?? linkedInProfile.currentRole;
        linkedInProfile.objective = objective ?? linkedInProfile.objective;

        const skillKeys = Object.keys(req.body.keySkills); // e.g., ["keySkill2", "keySkill5"] from the req.body in JSON format
        console.log("skillKeys: ", skillKeys);
        for (let i = 0; i < skillKeys.length; i++) {
            const skill = skillKeys[i];
            console.log("skill: ", skill)
            console.log("req.body.keySkills[skill]", req.body.keySkills[skill]);

            // Only update if the field exists in schema so user does not send any string e.g keySkill9 which is invalid
            if (linkedInProfile.keySkills.hasOwnProperty(skill)) {
                linkedInProfile.keySkills[skill] = req.body.keySkills[skill] ?? linkedInProfile.keySkills[skill];
            }
        }

        await linkedInProfile.save();
        return res.status(201).json({ message: "Linked In Profile Updated Succesfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createEventsToAttend = async (req, res) => {
    const userId = req.user._id;
    try {
        const { attendingEventIds } = req.body;
        if (!attendingEventIds || attendingEventIds.length === 0) {
            return res.status(400).json({ message: "You must select at least one event!" });
        }
        const attendingEvents = new events({
            user: userId,
            attendingEventIds
        });

        await attendingEvents.save();
        return res.status(201).json({
            message: "Events saved succesfully!",
        });

    } catch {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};