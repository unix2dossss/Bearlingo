
const predefinedNetworkingEvents = [

    {
        id: 1,
        name: "AI Builders Coffee & Walk – Auckland",
        type: "Meetup",
        date: "2025-10-20",
        location: "The Pantry, 99 Halsey Street, Auckland",
        link: "https://www.meetup.com/ai-driven-coding/events/308338688/",
        description:
            "A casual morning meetup for developers and AI enthusiasts. Discuss AI tools, automation, and creative coding while walking and networking with peers.",
        costType: "Free",
        time: "8:00AM - 9:30AM"
    },
    {
        id: 2,
        name: "EXIN BCS Artificial Intelligence Essentials Training",
        type: "Workshop",
        date: "2025-11-05",
        location: "Auckland CBD, New Zealand",
        link: "https://www.eventbrite.com/e/exin-bcs-artificial-intelligence-essentials-training-in-auckland-tickets-1427923470539",
        description:
            "An introductory AI certification training session covering the foundations of artificial intelligence, use cases, and ethical implications.",
        costType: "Paid",
        time: "9:00AM - 4:00PM"
    },
    {
        id: 3,
        name: "EXIN BCS Artificial Intelligence Foundation Training",
        type: "Workshop",
        date: "2025-11-12",
        location: "Auckland CBD, New Zealand",
        link: "https://www.eventbrite.com/e/exin-bcs-artificial-intelligence-foundation-training-in-auckland-tickets-1431619044099",
        description:
            "Gain foundational AI skills and understanding of common algorithms, tools, and data-driven decision making in this certified workshop.",
        costType: "Paid",
        time: "9:00AM - 4:00PM"
    },
    {
        id: 4,
        name: "EXIN BCS Generative Artificial Intelligence Award Training",
        type: "Workshop",
        date: "2025-11-20",
        location: "Auckland CBD, New Zealand",
        link: "https://www.eventbrite.com/e/exin-bcs-generative-artificial-intelligence-award-training-in-auckland-tickets-1430465513859",
        description:
            "Hands-on generative AI certification session covering modern LLMs, prompt design, and AI workflow automation.",
        costType: "Paid",
        time: "9:00AM - 4:00PM"
    },
    {
        id: 5,
        name: "New Zealand AI Summit 2025",
        type: "Conference",
        date: "2025-07-03",
        location: "Aotea Centre, Auckland",
        link: "https://10times.com/e1r4-p6z5-s2xp",
        description:
            "New Zealand’s premier AI event featuring industry leaders, researchers, and companies shaping the future of AI in NZ.",
        costType: "Paid",
        time: "9:00AM - 6:00PM"
    },
    {
        id: 6,
        name: "UiPath Agentic Automation Summit – Auckland",
        type: "Seminar",
        date: "2025-08-14",
        location: "Auckland CBD, New Zealand",
        link: "https://www.uipath.com/events/agentic-automation-summit/auckland",
        description:
            "A professional automation and AI conference exploring next-gen agentic workflows, RPA, and LLM-powered enterprise systems.",
        costType: "Free",
        time: "10:00AM - 4:00PM"
    },
    {
        id: 7,
        name: "The AI Show – Monthly AI Events",
        type: "Networking / Panel",
        date: "2025-10-28",
        location: "Auckland (venue announced monthly)",
        link: "https://newzealand.ai/ai-show-events",
        description:
            "A recurring AI event featuring panels, demos, and networking opportunities for students, researchers, and professionals.",
        costType: "Free",
        time: "6:00PM - 8:00PM"
    },
    {
        id: 8,
        name: "Let's Talk AI – Community Discussion",
        type: "Public Talk",
        date: "2025-06-15",
        location: "Auckland Central Library, 44-46 Lorne Street, Auckland",
        link: "https://ourauckland.aucklandcouncil.govt.nz/events/2025/06/let-s-talk-ai/",
        description:
            "A public discussion hosted by Auckland Council exploring the social and ethical impact of artificial intelligence in communities.",
        costType: "Free",
        time: "5:30PM - 7:00PM"
    },
    {
        id: 9,
        name: "Summer of Tech 2025 Info Session",
        type: "Webinar",
        date: "2025-09-10",
        location: "Online",
        link: "https://www.summeroftech.co.nz/events/info-session",
        description: "In order to attend one of Summer of Tech (SoT) events - you need to create an account for it (note that registrations are only open from Jan 2026 and close around June and if you are accessing it within this time, here is the registration link - https://app.summeroftech.co.nz/candidates/sign_in)",
        costType: "Free",
        time: "12:00PM - 1:00PM"
    },
    {
        id: 10,
        name: "SIRIS APPS AI Innovation Meetup",
        type: "Seminar",
        date: "2025-09-27",
        location: "31 Bentleigh Avenue Auckland, Auckland 0600",
        link: "https://www.eventbrite.co.nz/e/siris-apps-ai-innovation-meetup-tickets-1592659079179?aff=ebdssbdestsearch",
        description: "Join us for an exciting event where we delve into the world of artificial intelligence and its applications in various industries. From cutting-edge technology to practical solutions, this event will showcase the latest innovations in AI. Network with like-minded individuals and experts in the field at 31 Bentleigh Avenue. Don't miss out on this opportunity to learn, connect, and be inspired!",
        costType: "Free",
        time: "10:00AM - 11:30AM"
    },
    {
        id: 11,
        name: "The Science of Software Engineering",
        type: "Seminar",
        date: "2025-10-2",
        location: "Physics Lecture Theatre 1. PLT1/303-G20. Science Centre. 38 Princes Street Auckland, Auckland 1010",
        link: "https://www.eventbrite.co.nz/e/the-science-of-software-engineering-tickets-1343068537149?aff=ebdssbdestsearch",
        description: "Science & Tech • Science",
        costType: "Free",
        time: "6:00PM - 7:30PM"
    },
    {
        id: 12,
        name: "JuniorDev Auckland Meet",
        type: "Meetup",
        date: "2025-10-1",
        location: "XERO LIMITED NZ 96 Saint Georges Bay Road · Auckland",
        link: "https://www.meetup.com/juniordev-auckland/events/310930384/?eventOrigin=find_city_landing_topical_event&_gl=1*8vjl42*_up*MQ..*_ga*MTMwMjk3NTQwOC4xNzU4MzM2MzYw*_ga_NP82XMKW0P*czE3NTgzMzYzNjAkbzEkZzAkdDE3NTgzMzYzNjAkajYwJGwwJGgw",
        costType: "Free",
        description: " Talk 1: Software Engineering is a Team Sport by Jim Buchan. The talk will explore the following questions. Why is most Software Engineering mainly done in teams? Is it so hard? How should I act and behave to be a useful team member? What conditions will grow and maintain a healthy team?. Talk 2: How We Built Canva's MCP Server (Yes, You Can Build One Too!) by Anran Niu & William Guo. MCP (Model Context Protocol) is your exciting gateway to supercharging your AI workflows and unlocking incredible new possibilities. Join us for a behind-the-scenes look at how Canva teams build and use MCP servers to 10x productivity. We will demo our MCP server, share real workflow transformations, and most importantly - point you towards how to build your own MCP server from scratch. Perfect for junior developers ready to add more AI superpowers to their toolkit.",
        time: "6:00PM - 7:30PM"
    },
    {
        id: 13,
        name: "Auckland AI & Machine Learning Meetup",
        type: "Meetup",
        date: "2025-10-05",
        location: "Auckland University of Technology, Building W, Room 301 · Auckland",
        link: "https://www.meetup.com/auckland-ai-ml-meetup/events/310930385/",
        costType: "Free",
        description: "An evening of AI talks and networking. Topics include intro to machine learning workflows, AI in startups, and practical Python AI applications. Suitable for beginners and intermediate developers.",
        time: "5:30PM - 7:30PM"
    },
    {
        id: 14,
        name: "Women in Tech: AI & Innovation",
        type: "Workshop",
        date: "2025-10-10",
        location: "Vector HQ, 101 K Rd · Auckland",
        link: "https://www.eventbrite.co.nz/e/women-in-tech-ai-innovation-tickets-310930386",
        costType: "Free",
        description: "A workshop designed to inspire women in tech. Includes AI hands-on exercises, networking, and mentoring from industry leaders. Ideal for students and early career developers.",
        time: "6:00PM - 8:00PM"
    },
    {
        id: 15,
        name: "Auckland Tech Innovators Meetup",
        type: "Meetup",
        date: "2025-10-15",
        location: "Xero Limited NZ, 96 Saint Georges Bay Road · Auckland",
        link: "https://www.meetup.com/auckland-tech-innovators/events/310930387/",
        costType: "Free",
        description: "A networking meetup featuring talks on AI, cloud computing, and startup innovations. Includes Q&A and networking with Auckland tech professionals.",
        time: "6:00PM - 7:30PM"
    },
    {
        id: 16,
        name: "AI & Data Science Evening",
        type: "Seminar",
        date: "2025-10-20",
        location: "University of Auckland, School of Engineering, Room E3 · Auckland",
        link: "https://www.eventbrite.co.nz/e/ai-data-science-evening-tickets-310930388",
        costType: "Free",
        description: "An evening seminar exploring AI and data science applications in New Zealand industries. Includes presentations from local AI experts and career advice for students.",
        time: "5:30PM - 7:00PM"
    },
    {
        id: 17,
        name: "Junior Dev AI Hack Night",
        type: "Hackathon",
        date: "2025-10-25",
        location: "GridAKL, 96 Wellesley Street · Auckland",
        link: "https://www.meetup.com/juniordev-hack-night/events/310930389/",
        costType: "Free",
        description: "Hands-on hack night where junior developers can build small AI projects, collaborate with peers, and receive mentorship from industry professionals. Bring your laptop and ideas!",
        time: "6:00PM - 9:00PM"
    }
];

export default predefinedNetworkingEvents;