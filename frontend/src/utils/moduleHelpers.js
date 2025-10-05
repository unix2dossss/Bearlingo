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
  if (!subtask)
    throw new Error(`Subtask ${sequenceNumber} not found in "${module.name}" level ${levelNumber}`);
  return subtask._id;
};

// Check if user has completed a specific subtask
export const isSubtaskCompleted = async (moduleName, levelNumber, sequenceNumber) => {
  try {
    // 1. Get the module
    const module = await getModuleByName(moduleName);

    // 2. Get the level
    const level = getLevelByNumber(module, levelNumber);

    // 3. Get the subtaskId
    const subtaskId = await getSubtaskBySequenceNumber(moduleName, levelNumber, sequenceNumber);

    // 4. Get user progress for this module
    const res = await api.get(`/users/progress/module/${module._id}`, { withCredentials: true });
    const moduleProgress = res.data;

    const levelProgresses = moduleProgress?.levelProgresses;
    if (!Array.isArray(levelProgresses)) {
      return false; // no progress yet
    }

    // 5. Find progress for this level
    const levelProgressObject = levelProgresses.find((lp) => lp.levelProgress.level === level._id);

    if (!levelProgressObject) return false; // no progress on this level yet

    // 6. Check if subtaskId is inside completedSubtasks
    return levelProgressObject.levelProgress.completedSubtasks.includes(subtaskId);
  } catch (err) {
    console.error("Error checking subtask completion:", err.message);
    return false;
  }
};
