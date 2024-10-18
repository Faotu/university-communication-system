"use client";
import ClassRoom from "@/components/ClassRoom";
import ClassSetup from "@/components/ClassSetup";
import Loader from "@/components/Loader";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />;
  return (
    // <main className="h-screen w-full">
    //   <StreamCall call={call}>
    //     <StreamTheme>
    //       {!isSetupComplete ? <ClassSetup setIsSetupComplete={setIsSetupComplete}/> : <ClassRoom />}
    //     </StreamTheme>
    //   </StreamCall>
    // </main>
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <ClassSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <ClassRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
