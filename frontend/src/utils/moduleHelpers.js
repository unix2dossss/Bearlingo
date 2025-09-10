import api from "../lib/axios";

export const getModuleByName = async (partialName) => {
  const modulesRes = await api.get("/modules", { withCredentials: true });
  const modules = modulesRes.data;
  const query = partialName.toLowerCase();
  const module = modules.find((mod) => mod.name.toLowerCase().includes(query));
  if (!module) throw new Error(`Module matching "${partialName}" not found`);
  return module;
};

export const getLevelByNumber = (module, levelNumber) => {
  const level = module.levels.find((lvl) => lvl.levelNumber === levelNumber);
  if (!level) throw new Error(`Level ${levelNumber} not found in "${module.name}"`);
  return level;
};

export const getSubtasksByLevel = async (level) => {
  const res = await api.get(`/modules/level-subtasks/${level._id}`, { withCredentials: true });
  return res.data;
};


export const getSubtaskBySequenceNumber = async (moduleName, levelNumber, sequenceNumber) => {
  const module = await getModuleByName(moduleName);
  const level = getLevelByNumber(module, levelNumber);
  const subtasks = await getSubtasksByLevel(level);
  const subtask = subtasks.find((st) => st.sequenceNumber === sequenceNumber);
  if (!subtask) throw new Error(`Subtask ${sequenceNumber} not found in "${module.name}" level ${levelNumber}`);
  return subtask._id;
};

