const groupedSkillMap = {
  "Programming & Data": [
    "Python",
    "SQL",
    "Machine Learning",
    "Statistics",
    "Data Visualization",
    "TensorFlow",
    "Deep Learning",
    "Data Structures",
    "Algorithms",
    "C","C++","Java"
  ],
  "Web & Design": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Photoshop",
    "Illustrator",
    "Typography",
    "Layout Design",
    "AutoCAD",
    "SketchUp",
  ],
  "Medical & Health": [
    "Biology",
    "Anatomy",
    "Medical Knowledge",
    "Pharmacology",
    "Diagnosis",
    "Surgery",
    "Exercise Techniques",
    "Nutrition",
  ],
  "Communication & Writing": [
    "Writing",
    "Editing",
    "Public Speaking",
    "Empathy",
    "Active Listening",
    "Counseling",
    "Argumentation",
  ],
  "Business & Marketing": [
    "SEO",
    "Content Strategy",
    "Sales",
    "Negotiation",
    "Market Research",
    "Finance",
    "Marketing",
  ],
  "Education & Social Work": [
    "Teaching",
    "Curriculum Design",
    "Community Outreach",
    "Event Planning",
    "Fundraising",
  ],
  "Security & Infrastructure": [
    "Networking",
    "Security Protocols",
    "Ethical Hacking",
    "Firewalls",
    "Monitoring Tools",
  ],
  Other: [
    "Leadership",
    "Critical Thinking",
    "Creativity",
    "Problem Solving",
    "Time Management",
    "Teamwork",
    "Cleanliness",
  ],
};

function groupSkills(skills) {
  const grouped = {};

  for (const skill of skills) {
    let found = false;

    for (const [category, list] of Object.entries(groupedSkillMap)) {
      if (list.includes(skill)) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(skill);
        found = true;
        break;
      }
    }

    // fallback to Other if not found anywhere
    if (!found) {
      if (!grouped.Other) grouped.Other = [];
      grouped.Other.push(skill);
    }
  }

  return grouped;
}

module.exports = groupSkills;
