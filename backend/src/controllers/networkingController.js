import linkedinprofile from "../models/LinkedInProfile.js";
import events from "../models/AttendedEvent.js";
import networkingReflection from "../models/networkingReflection.js";
import definedQuestions from "../utils/networkingReflectionQs.js";

export const createLinkedInProfile = async (req, res) => {
    const userId = req.user._id;
    // Check if id is valid
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
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
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
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

        const skillKeys = Object.keys(keySkills); // e.g., ["keySkill2", "keySkill5"] from the req.body in JSON format
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
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
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

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};


export const updateEventsToAttend = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const attendingEventIds = req.body.attendingEventIds;
        const userEvents = await events.findOne({ user: userId });

        console.log("attendingEventIds: ", attendingEventIds);
        if (!userEvents) {
            return createEventsToAttend(req, res);
        }

        attendingEventIds.forEach(updateEvent => {
            console.log("updateEvent: ", updateEvent);
            const idx = userEvents.attendingEventIds.findIndex(
                e => e.eventId === updateEvent.eventId
            ); // Checking if an event exists in the database for the user (hence idx == -1 would mean that it is not in the user's events saved in the database)

            if (idx !== -1) {
                // Update existing event status
                userEvents.attendingEventIds[idx].status = updateEvent.status;
            } else {
                // Or push new event if not in the list yet
                userEvents.attendingEventIds.push(updateEvent);
            }
        });
        await userEvents.save();
        return res.status(201).json({ message: "Your events are updated!" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createReflection = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const { responses, event } = req.body; // Javascript does not destructure nested properties using dot notation

        if (!responses || responses.length === 0) {
            return res.status(400).json({ message: "No responses provided" });
        }


        // Check each response's question then the answer is valid
        for (const response of responses) {
            if (!definedQuestions.includes(response.question)) {
                return res.status(400).json({ message: "Invalid question submitted" });
            }
            if (response.answer < 1 || response.answer > 5) {
                return res.status(400).json({ message: "Answer must be between 1 and 5" });
            }
        }

        const newNetworkingReflection = new networkingReflection({
            user: userId,
            responses,
            event
        });

        await newNetworkingReflection.save();
        return res.status(201).json({ message: "Reflection saved!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

