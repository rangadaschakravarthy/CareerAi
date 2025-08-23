function getSkillGap(currentSkills = [], requiredSkills = []) {
  const normalize = (s) =>
    s.trim().toLowerCase().replace(/^[^a-z0-9]+/i, ""); // remove leading non-alphanumerics

  const current = new Set(currentSkills.map(normalize));
  const required = new Set(requiredSkills.map(normalize));

  const gap = [...required].filter((skill) => !current.has(skill));
  return gap;
}

module.exports = getSkillGap;
