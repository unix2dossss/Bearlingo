import React from "react";

const ReflectionsContent = ({
  openFolder,
  openFile,
  setOpenFile,
  addFile,
  setAddFile,
  messages,
  input,
  setInput,
  handleSend,
  isTyping,
  currentIndex
}) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {addFile ? (
        <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
          <div className="bg-white w-[100%] h-[90%] p-6 rounded-xl shadow-lg flex flex-col gap-3 overflow-y-scroll">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-purple-100 text-purple-800 self-end"
                      : "bg-purple-200 text-purple-900"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-purple-400">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-100">•</span>
              </div>
            )}

            {!isTyping && currentIndex < 9 && (
              <div className="flex mt-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  onClick={handleSend}
                  className="ml-2 bg-purple-500 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-600"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
          {openFile ? (
            <div className="p-4 bg-white rounded-lg shadow-sm h-full flex flex-col">
              <h1 className="text-purple-800 font-semibold mb-2 text-xl mt-2">{openFile.title}</h1>
              <div className=" mt-auto flex justify-center items-center p-2">
                <button
                  className="mt-4 btn btn-ghost w-40 border border-purple-500"
                  onClick={() => setOpenFile(null)}
                >
                  Back to Reflections Overview
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {openFolder.items.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <span className="text-purple-800 font-medium">
                    {file.fileName}
                    <p className="text-purple-500 font-light text-sm italic">{file.text}</p>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ReflectionsContent;
