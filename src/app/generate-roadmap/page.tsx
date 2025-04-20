"use client";

import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import Image from "next/image";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-mono animate-text-fade">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Coding Roadmap</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 animate-text-fade">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative animate-card-hover">
            <div className="aspect-video flex flex-col items-center justify-center p-4 md:p-6 relative">
              <div className={`absolute inset-0 ${isSpeaking ? "opacity-30" : "opacity-0"} transition-opacity duration-300`}>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-16 md:h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-0.5 md:mx-1 h-12 md:h-16 w-0.5 md:w-1 bg-primary rounded-full ${isSpeaking ? "animate-sound-wave" : ""}`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative size-24 md:size-32 mb-4">
                <div className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${isSpeaking ? "animate-pulse" : ""}`} />
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10">
                    <Image
                      src="/ai_hero2.png"
                      alt="AI Assistant"
                      className="w-full h-full object-cover animate-image-fade"
                      width={128}
                      height={128}
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground animate-text-fade">100xDevs AI</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 animate-text-fade">Coding Roadmap Generator</p>
              <div className={`mt-4 flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-card border border-border ${isSpeaking ? "border-primary" : ""}`}>
                <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : callActive ? "bg-secondary" : callEnded ? "bg-green-600" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground animate-text-fade">
                  {isSpeaking ? "Speaking..." : callActive ? "Listening..." : callEnded ? "Redirecting to profile..." : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>
          <Card className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative animate-card-hover`}>
            <div className="aspect-video flex flex-col items-center justify-center p-4 md:p-6 relative">
              <div className="relative size-24 md:size-32 mb-4">
                <Image
                  //@ts-expect-error - user.imageUrl is not typed
                  src={user?.imageUrl}
                  alt="User"
                  className="size-full object-cover rounded-full animate-image-fade"
                  width={128}
                  height={128}
                />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground animate-text-fade">You</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 animate-text-fade">
                {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
              </p>
              <div className={`mt-4 flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-card border`}>
                <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground animate-text-fade">Ready</span>
              </div>
            </div>
          </Card>
        </div>
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-3 md:p-4 mb-8 h-48 md:h-64 overflow-y-auto transition-all duration-300 scroll-smooth animate-card-hover"
          >
            <div className="space-y-2 md:space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1 animate-text-fade">
                    {msg.role === "assistant" ? "100xDevs AI" : "You"}:
                  </div>
                  <p className="text-foreground text-sm md:text-base animate-text-fade">{msg.content}</p>
                </div>
              ))}
              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1 animate-text-fade">System:</div>
                  <p className="text-foreground text-sm md:text-base animate-text-fade">
                    Your coding roadmap has been created! Redirecting to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="w-full flex justify-center gap-4">
          <PulsatingButton
            className={`w-32 md:w-40 text-lg md:text-xl rounded-2xl md:rounded-3xl ${callActive ? "bg-destructive hover:bg-destructive/90" : callEnded ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"} text-white relative animate-button-hover`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}
            <span className="animate-text-fade">
              {callActive ? "End Call" : connecting ? "Connecting..." : callEnded ? "View Profile" : "Start Call"}
            </span>
          </PulsatingButton>
        </div>
      </div>
    </div>
  );
};
export default GenerateProgramPage;