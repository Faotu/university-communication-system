"use client";
import ClassRoom from "@/components/ClassRoom";
import ClassSetup from "@/components/ClassSetup";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const Meeting = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  return (
    <main className="h-screen w-full">
      <StreamCall call={}>
        <StreamTheme>
          {!isSetupComplete ? <ClassSetup /> : <ClassRoom />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
