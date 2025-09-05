// Chat feature barrel exports - Updated for backend integration
export * from "./api";
export * from "./chatContext";
export { useChatStore } from "./chatStore"; // Keep for backward compatibility

// SignalR exports - will be enabled when SignalR is fully implemented
// export { 
//   signalRService, 
//   useSignalRChat, 
//   createChatConnection,
//   type SignalRCallbacks,
//   type ChatConnection
// } from "./signalRService";
