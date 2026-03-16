import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { agents, conversations as initConvs } from "../data/mockData";

export default function MessagingPage() {
  const [convs, setConvs] = useState(initConvs);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const active = convs.find((c) => c.id === activeId);
  const otherName = (c: (typeof convs)[0]) => c.participantNames[1];

  const sendMessage = () => {
    if (!newMsg.trim() || !activeId) return;
    setConvs((prev) =>
      prev.map((c) =>
        c.id !== activeId
          ? c
          : {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  senderId: "me",
                  content: newMsg,
                  timestamp: "Just now",
                  read: true,
                },
              ],
              lastMessage: newMsg,
              lastTime: "Just now",
            },
      ),
    );
    setNewMsg("");
  };

  const openConv = (id: string) => {
    setActiveId(id);
    setMobileView("chat");
  };

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-8">
      <div className="flex h-[calc(100vh-7rem)] bg-card border border-border rounded-none sm:rounded-2xl overflow-hidden">
        {/* Conversation list */}
        <div
          className={`w-full sm:w-80 flex-shrink-0 border-r border-border flex flex-col ${
            mobileView === "chat" ? "hidden sm:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convs.map((c, i) => (
              <button
                type="button"
                key={c.id}
                className={`w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  activeId === c.id ? "bg-primary/5" : ""
                }`}
                onClick={() => openConv(c.id)}
                data-ocid={`messages.conv.${i + 1}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{otherName(c)[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm truncate">
                      {otherName(c)}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {c.lastTime}
                    </span>
                  </div>
                  {c.propertyTitle && (
                    <p className="text-xs text-primary truncate">
                      {c.propertyTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {c.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat view */}
        <div
          className={`flex-1 flex flex-col ${
            mobileView === "list" ? "hidden sm:flex" : "flex"
          }`}
        >
          {active ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <button
                  type="button"
                  className="sm:hidden p-1"
                  onClick={() => setMobileView("list")}
                  data-ocid="messages.back.button"
                >
                  <ArrowLeft size={18} />
                </button>
                <Avatar className="w-9 h-9">
                  <AvatarFallback>{otherName(active)[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{otherName(active)}</p>
                  {active.propertyTitle && (
                    <p className="text-xs text-muted-foreground">
                      {active.propertyTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {active.messages.map((m, i) => (
                  <div
                    key={m.id}
                    className={`flex ${m.senderId === "me" ? "justify-end" : "justify-start"}`}
                    data-ocid={`chat.message.${i + 1}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        m.senderId === "me"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      }`}
                    >
                      {m.content}
                      <p className={"text-xs mt-1 opacity-70"}>{m.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  data-ocid="chat.message.input"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  data-ocid="chat.send.button"
                >
                  <Send size={16} />
                </Button>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex items-center justify-center text-muted-foreground"
              data-ocid="messages.empty_state"
            >
              <div className="text-center">
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">
                  Choose a chat from the left to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
