import React from "react";
import GoalsContent from "./GoalsContent";
import ReflectionsContent from "./ReflectionsContent";

const FolderModal = ({
  openFolder,
  setOpenFolder,
  openFile,
  setOpenFile,
  showAddFileModal,
  setShowAddFileModal,
  addFile,
  setAddFile,
  newFileName,
  setNewFileName,
  messages,
  setMessages,
  input,
  setInput,
  handleSend,
  isTyping,
  currentIndex,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
      <div className="relative bg-white max-w-6xl w-[90%] h-[85%] rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpenFolder(null);
                setOpenFile(null);
              }}
              className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-gray text-xs flex items-center justify-center"
              aria-label="Close"
            >X</button>
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-500" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-purple-600 text-center flex-1">
            {openFolder.name}
          </h2>
          <div className="w-10" />
        </div>

        {/* Conditional content */}
        {openFolder.name === "Goals" && (
          <GoalsContent
            openFolder={openFolder}
            openFile={openFile}
            setOpenFile={setOpenFile}
            showAddFileModal={showAddFileModal}
            setShowAddFileModal={setShowAddFileModal}
            newFileName={newFileName}
            setNewFileName={setNewFileName}
          />
        )}

        {openFolder.name === "Reflections" && (
          <ReflectionsContent
            openFolder={openFolder}
            openFile={openFile}
            setOpenFile={setOpenFile}
            addFile={addFile}
            setAddFile={setAddFile}
            messages={messages}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isTyping={isTyping}
            currentIndex={currentIndex}
          />
        )}
      </div>
    </div>
  );
};

export default FolderModal;
