import mongoose from "mongoose";
import linkedinprofile from "../models/LinkedInProfile.js";
import User from "../models/User.js";
import events from "../models/AttendedEvent.js";
import networkingReflection from "../models/networkingReflection.js";
import definedQuestions from "../utils/networkingReflectionQs.js";
import linkedinpost from "../models/LinkedInPost.js";
import LinkedInProfile from "../models/LinkedInProfile.js";
import allEvents from "../utils/networkingEvents.js";
import { updateUserStreak } from "../utils/helpers.js";
// NEED TO ADD HELPER FOR UPDATING THE STREAK!!!! Weeks 9 - 10 add validation for fields from body e.g. if event exists for the user in database when created a post to the related event!! Also when creating an new instance of a schema (POST request) e.g. linkedinpost check if the user already has a post of the same user id and event then it will jsut need to be updated (PUT request)

// -------- LinkedIn profile handlers --------

export const createLinkedInProfile = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    // Check if id is valid
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        console.log("Incoming request body:", req.body);
        console.log("Authenticated user:", req.user);
        const { firstName, lastName, profressionalHeadline, university, keySkills, objective } = req.body;

        const linkedInProfile = new linkedinprofile({
            user: userId,
            firstName,
            lastName,
            profressionalHeadline,
            university,
            keySkills,
            objective
        });
        await linkedInProfile.save();
        updateUserStreak(user);
        res.status(201).json({
            message: "Linked In Profile Created Succesfully!",
            linkedInProfile: linkedInProfile
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getLinkedInProfile = async (req, res) => {
    const userId = req.user._id;
    try {
        const linkedInProfile = await LinkedInProfile.findOne({ user: userId });
        if (!linkedInProfile) {
            return res.status(200).json({ message: "LinkedIn Profile not found" });
        }
        return res.status(200).json({ message: "Linked In Profile Retrieved Succesfully!", linkedInProfile: linkedInProfile });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateLinkedInProfile = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const { firstName, lastName, profressionalHeadline, university, keySkills, objective } = req.body;
        const linkedInProfile = await linkedinprofile.findOne({ user: userId });

        if (!linkedInProfile) {
            return createLinkedInProfile(req, res);
        }

        linkedInProfile.firstName = firstName ?? linkedInProfile.firstName; //If req.body.firstName is undefined, it keep old value. If it’s an empty string then it updates it to empty string
        linkedInProfile.lastName = lastName ?? linkedInProfile.lastName;
        linkedInProfile.profressionalHeadline = profressionalHeadline ?? linkedInProfile.profressionalHeadline;
        linkedInProfile.university = university ?? linkedInProfile.university;
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
        return res.status(201).json({ message: "Linked In profile updated succesfully!", linkedInProfile: linkedInProfile });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// -------- Events to attend handlers --------

export const createEventsToAttend = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
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
        updateUserStreak(user);
        return res.status(201).json({
            message: "Events saved succesfully!",
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

export const getEventsToAttend = async (req, res) => {
    const userId = req.user._id;
    try {
        const eventsToAttend = await events.find({ user: userId });
        return res.status(200).json({ message: "Events found succesfully!", eventsToAttend: eventsToAttend });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
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

        if (!userEvents) {
            return createEventsToAttend(req, res);
        }

        attendingEventIds.forEach(updateEvent => {
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


// -------- Networking reflections handlers --------

export const createReflection = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const { title, responses, event } = req.body; // Javascript does not destructure nested properties using dot notation

        if (!title || title.length > 100) {
            return res.status(400).json({ message: "Need a title less than 100 characters!" });
        }

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
            title: title,
            responses,
            event
        });

        await newNetworkingReflection.save();
        updateUserStreak(user);
        return res.status(201).json({ message: "Reflection saved!", reflection: newNetworkingReflection });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getReflections = async (req, res) => {
    const userId = req.user._id;
    try {
        const reflections = await networkingReflection.find({ user: userId });
        return res.status(200).json({ message: "Reflections found succesfully!", reflections: reflections });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// -------- LinkedIn post handlers --------

export const createLinkedInPost = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const { event, whyAttend, whatLearned, howApply, hashtags } = req.body;
        const linkedInPost = new linkedinpost({
            user: userId,
            event,
            whyAttend,
            whatLearned,
            howApply,
            hashtags
        });
        await linkedInPost.save();
        updateUserStreak(user);
        return res.status(201).json({ message: "LinkedIn post created succesfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getLinkedInPost = async (req, res) => {
    const userId = req.user._id;
    try {
        const linkedInPost = await linkedinpost.findOne({ user: userId });
        return res.status(200).json({ message: "LinkedIn post found succesfully!", linkedInPost: linkedInPost });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateLinkedInPost = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    } try {
        const { event, whyAttend, whatLearned, howApply, hashtags } = req.body;
        const linkedInPost = await linkedinpost.findOne({ user: userId }, { event: event });
        if (!linkedInPost) {
            return createLinkedInPost(req, res);
        }
        linkedInPost.whyAttend = whyAttend ?? linkedInPost.whyAttend;
        linkedInPost.whatLearned = whatLearned ?? linkedInPost.whatLearned;
        linkedInPost.howApply = howApply ?? linkedInPost.howApply;
        linkedInPost.hashtags = hashtags ?? linkedInPost.hashtags;

        await linkedInPost.save();
        return res.status(201).json({ message: "LinkedIn post created succesfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }

};



// -------- Getting all events handler --------

export const getAllEvents = async (req, res) => {
    const userId = req.user._id;
    try {
        const allEventsFromBackend = allEvents;
        return res.status(200).json({ message: "All events retrieved succesfully!", allEventsFromBackend: allEventsFromBackend });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


