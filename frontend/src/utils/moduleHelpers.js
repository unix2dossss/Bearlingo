import api from "../lib/axios";

// Get a module by name (case-insensitive, partial match)
export const getModuleByName = async (partialName) => {
  const modulesRes = await api.get("/modules", { withCredentials: true });
  const modules = modulesRes.data;
  const query = partialName.toLowerCase();
  const module = modules.find((mod) => mod.name.toLowerCase().includes(query));
  if (!module) throw new Error(`Module matching "${partialName}" not found`);
  return module;
};

// Get a level by module and level number
export const getLevelByNumber = (module, levelNumber) => {
  const level = module.levels.find((lvl) => lvl.levelNumber === levelNumber);
  if (!level) throw new Error(`Level ${levelNumber} not found in "${module.name}"`);
  return level;
};

// Get all subtasks for a level
export const getSubtasksByLevel = async (level) => {
  const res = await api.get(`/modules/level-subtasks/${level._id}`, { withCredentials: true });
  return res.data;
};

// Get a subtask by module name, level number, and sequence number
export const getSubtaskBySequenceNumber = async (moduleName, levelNumber, sequenceNumber) => {
  const module = await getModuleByName(moduleName);
  const level = getLevelByNumber(module, levelNumber);
  const subtasks = await getSubtasksByLevel(level);
  const subtask = subtasks.find((st) => st.sequenceNumber === sequenceNumber);
  if (!subtask) throw new Error(`Subtask ${sequenceNumber} not found in "${module.name}" level ${levelNumber}`);
  return subtask._id;
};

