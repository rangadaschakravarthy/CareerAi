function parseCareerData(text) {
  const extractSection = (label) => {
    const pattern = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*|$)`, 'i');
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  const cleanList = (block) => {
    return block
      .split(/\r?\n|,\s*/)
      .map((item) => item.replace(/^[-*•\s]+/, '').trim())
      .filter(Boolean);
  };

  const career = extractSection("Career");
  const description = extractSection("Description");
  const salaryRange = extractSection("Salary Range");

  const skills = cleanList(extractSection("Skills Needed"));
  const tools = cleanList(extractSection("Tools"));
  const courses = cleanList(extractSection("Courses"));

  return {
    career,
    description,
    skills,
    tools,
    salaryRange,
    courses,
  };
}

module.exports = parseCareerData;
